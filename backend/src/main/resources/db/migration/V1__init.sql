-- CATAMS 数据库初始化脚本
-- 环境：MySQL 8 / InnoDB / utf8mb4
-- 功能：课程分配、工时管理、审批流、预算控制、审计日志

SET NAMES utf8mb4;


-- ==========================================================
-- 用户表：存放系统中的所有人员（Lecturer / Tutor / HR / Admin）
-- ==========================================================
CREATE TABLE user (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(64)  NOT NULL,
  email         VARCHAR(128) NOT NULL UNIQUE,
  role          ENUM('Lecturer','Tutor','HR','Admin') NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- ==========================================================
-- 课程表：存放课程基础信息 + 预算
-- ==========================================================
CREATE TABLE course_unit (
  id                    BIGINT PRIMARY KEY AUTO_INCREMENT,
  code                  VARCHAR(32)  NOT NULL,        -- 课程代码（如 COMP5348）
  name                  VARCHAR(128) NOT NULL,        -- 课程名称
  semester              VARCHAR(16)  NOT NULL,        -- 学期（2025S1, 2025S2）
  start_date            DATE         NOT NULL,
  end_date              DATE         NOT NULL,
  total_budget_hours    DECIMAL(6,2) NOT NULL,        -- 总预算工时
  remaining_budget      DECIMAL(6,2) NOT NULL,        -- 剩余预算工时
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_semester (semester),
  KEY idx_code_sem (code, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程表';

-- 目标：
--   1) 引入 unit_task_type（任务类型）与 unit_task（具体任务）
--   2) 引入 planned_task_allocation（讲师预分配/计划）
--   3) 扩展 work_entry 以挂接到具体 task/计划，支持替班、计划与实际对比
-- 设计要点：
--   - 计划 != 实际：计划存于 planned_task_allocation；实际依旧由 tutor 在 work_entry 提交并走审批【已有表结构见 V1】。
--   - 替班：work_entry 通过 origin_planned_id 指向原计划；tutor_id 记录“实际执教者”。
--   - 一周可多任务：取消“tutor+unit+week 唯一”，改为“tutor+unit+task+week 唯一”。
--   - 保留 work_entry.work_type 以兼容旧数据；若指定 task，可由应用层用 task.type_name 回填/校验。
-- ==========================================================

-- ==========================================================
-- 1) 任务类型表：每个 unit 下的类型（如 Tutorial / Lab / Marking）
-- ==========================================================
CREATE TABLE IF NOT EXISTS unit_task_type (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  unit_id     BIGINT       NOT NULL,
  name        VARCHAR(100) NOT NULL,                           -- 类型名（同一 unit 内唯一）
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ttype_unit FOREIGN KEY (unit_id) REFERENCES course_unit(id),
  UNIQUE KEY uk_unit_type (unit_id, name),                     -- 防止同一课程重复定义同名类型
  KEY idx_unit (unit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务类型表（按课程维度）';

-- ==========================================================
-- 2) 任务表：某 unit 下的具体任务（从属于一个任务类型）
--    示例：Tutorial 1 Fri 13:00-15:00
-- ==========================================================
CREATE TABLE IF NOT EXISTS unit_task (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  unit_id     BIGINT       NOT NULL,
  type_id     BIGINT       NOT NULL,
  name        VARCHAR(200) NOT NULL,                            -- 任务名（同一 unit 内可重复，通常不强制唯一）
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,                  -- 软禁用/归档
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_task_unit  FOREIGN KEY (unit_id) REFERENCES course_unit(id),
  CONSTRAINT fk_task_type  FOREIGN KEY (type_id) REFERENCES unit_task_type(id),
  KEY idx_unit (unit_id),
  KEY idx_type (type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程内的具体任务';

-- ==========================================================
-- 3) 讲师预分配（计划）表：把“某任务”的“某周小时数”分配给“某 Tutor”
--    - 仅记录“计划”，不产生预算占用；预算仍在 work_entry 审批流里扣/返
--    - 若发生替班：实际提交方在 work_entry 中引用本行 id（见第 4 节）
-- ==========================================================
CREATE TABLE IF NOT EXISTS planned_task_allocation (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  task_id         BIGINT       NOT NULL,                        -- 对应 unit_task
  tutor_id        BIGINT       NOT NULL,                        -- 计划承接的 Tutor
  week_start      DATE         NOT NULL,                        -- 周起始日期（与 work_entry.week_start 对齐）
  planned_hours   DECIMAL(4,2) NOT NULL,                        -- 计划工时
  note            VARCHAR(255) NULL,                            -- 讲师备注（可选）
  created_by      BIGINT       NULL,                            -- 记录创建人（通常为 Lecturer）
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_plan_task  FOREIGN KEY (task_id)  REFERENCES unit_task(id),
  CONSTRAINT fk_plan_tutor FOREIGN KEY (tutor_id) REFERENCES user(id),
  CONSTRAINT fk_plan_creator FOREIGN KEY (created_by) REFERENCES user(id),
  UNIQUE KEY uk_task_tutor_week (task_id, tutor_id, week_start),-- 防止重复分配
  KEY idx_tutor_week (tutor_id, week_start),
  KEY idx_task_week (task_id, week_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务预分配（计划）表';


-- ==========================================================
-- 课程角色分配表（替代 tutor_assignment）
-- 支持：TUTOR / LECTURER / MARKER 等不同角色
-- ==========================================================
CREATE TABLE unit_assignment (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  unit_id      BIGINT NOT NULL,                       -- 课程 ID
  user_id      BIGINT NOT NULL,                       -- 用户 ID（Tutor / Lecturer）
  role         ENUM('TUTOR','LECTURER','MARKER') NOT NULL DEFAULT 'TUTOR',
  pay_rate     DECIMAL(8,2) NULL,                     -- 工资，仅 TUTOR 需要
  quota_hours  DECIMAL(6,2) NULL,                     -- 分配工时配额（可选）
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES course_unit(id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  UNIQUE KEY uk_unit_user_role (unit_id, user_id, role),  -- 避免重复分配
  KEY idx_unit (unit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程角色分配表';

-- ==========================================================
-- 工时记录表：Tutor 提交的工时
-- ==========================================================
CREATE TABLE work_entry (
  id                 BIGINT PRIMARY KEY AUTO_INCREMENT,
  tutor_id           BIGINT       NOT NULL,           -- 实际提交人（Tutor）
  unit_id            BIGINT       NOT NULL,           -- 所属课程
  unit_code          VARCHAR(32)  NULL COMMENT '课程代码快照',
  unit_name          VARCHAR(128) NULL COMMENT '课程名称快照',
  task_id            BIGINT       NULL,               -- 对应的具体任务（unit_task.id）
  origin_planned_id  BIGINT       NULL,               -- 来源于哪个计划分配（planned_task_allocation.id）
  week_start         DATE         NOT NULL,           -- 周起始日期
  hours              DECIMAL(4,2) NOT NULL,           -- 实际工时
  work_type          VARCHAR(32)  NOT NULL,           -- 工作类型（Lab, Tutorial…，兼容旧数据）
  description        TEXT NULL,                       -- 描述
  pay_rate_snapshot  DECIMAL(8,2) NOT NULL,           -- 工资快照
  source             ENUM('PLANNED','ADHOC') NOT NULL DEFAULT 'ADHOC' COMMENT '来源：计划生成 / 临时新增',
  status             ENUM('DRAFT','SUBMITTED','APPROVED_BY_LECTURER','FINAL_APPROVED','REJECTED') NOT NULL,
  version            INT          NOT NULL DEFAULT 0, -- 乐观锁版本号
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- 外键约束
  CONSTRAINT fk_we_tutor  FOREIGN KEY (tutor_id) REFERENCES user(id),
  CONSTRAINT fk_we_unit   FOREIGN KEY (unit_id)  REFERENCES course_unit(id),
  CONSTRAINT fk_we_task   FOREIGN KEY (task_id) REFERENCES unit_task(id),
  CONSTRAINT fk_we_plan   FOREIGN KEY (origin_planned_id) REFERENCES planned_task_allocation(id),

  -- 唯一约束：允许同一周多任务，只要 task_id 不同即可
  UNIQUE KEY uk_tutor_unit_task_week (tutor_id, unit_id, task_id, week_start),

  -- 常用索引
  KEY idx_unit_status (unit_id, status),
  KEY idx_tutor_week (tutor_id, week_start),
  KEY idx_plan_ref (origin_planned_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='工时记录表（支持计划、任务维度、替班）';


-- ==========================================================
-- 审批任务表：记录每一步审批（待办 + 审批日志）
-- ==========================================================
CREATE TABLE approval_task (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  entry_id    BIGINT NOT NULL,                        -- 对应工时记录
  step        ENUM('LECTURER','TUTOR','HR') NOT NULL, -- 审批步骤
  action      ENUM('SUBMITTED','APPROVE','REJECT') NULL,          -- 审批结果（SUBMITTED表示待办）
  comment     TEXT NULL,                              -- 审批意见
  actor_id    BIGINT NULL,                            -- 审批人 ID
  actor_name  VARCHAR(100) NULL COMMENT '审批人姓名',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  CONSTRAINT fk_at_entry FOREIGN KEY (entry_id) REFERENCES work_entry(id),
  CONSTRAINT fk_at_actor FOREIGN KEY (actor_id) REFERENCES user(id),
  KEY idx_entry_step (entry_id, step),
  KEY idx_actor_time (actor_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审批任务表';

-- ==========================================================
-- 预算流水表：记录预算的每次占用与释放
-- ==========================================================
CREATE TABLE budget_ledger (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  unit_id       BIGINT NOT NULL,
  delta_hours   DECIMAL(6,2) NOT NULL,  -- 占用为负，释放为正
  balance       DECIMAL(6,2) NOT NULL,  -- 剩余预算快照
  ref_table     VARCHAR(32)  NOT NULL,  -- 来源表（如 work_entry）
  ref_id        BIGINT       NOT NULL,  -- 来源 ID
  reason        VARCHAR(64)  NOT NULL,  -- SUBMIT / REJECT / FINAL_APPROVED / ADJUST
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bl_unit FOREIGN KEY (unit_id) REFERENCES course_unit(id),
  KEY idx_unit_time (unit_id, created_at),
  KEY idx_ref (ref_table, ref_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预算流水表';

-- ==========================================================
-- 审计日志表：记录所有关键操作，用于安全审计
-- ==========================================================
CREATE TABLE audit_log (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  actor         BIGINT       NOT NULL,                -- 操作者
  actor_role    ENUM('Lecturer','Tutor','HR','Admin') NOT NULL,
  action        VARCHAR(64)  NOT NULL,                -- 操作类型
  resource_type VARCHAR(64)  NOT NULL,                -- 资源类型
  resource_id   BIGINT       NOT NULL,                -- 资源 ID
  before_data   JSON NULL,                            -- 修改前数据
  after_data    JSON NULL,                            -- 修改后数据
  ip            VARCHAR(45)  NULL,                    -- IP 地址
  ua            VARCHAR(256) NULL,                    -- User-Agent
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_resource (resource_type, resource_id),
  KEY idx_actor_time (actor, created_at),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审计日志表';

