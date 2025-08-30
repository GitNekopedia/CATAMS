-- CATAMS 数据库初始化脚本
-- MySQL 8 / InnoDB / utf8mb4

SET NAMES utf8mb4;

-- 用户表
CREATE TABLE user (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(64)  NOT NULL,
  email         VARCHAR(128) NOT NULL UNIQUE,
  role          ENUM('Lecturer','Tutor','HR','Admin') NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 课程表
CREATE TABLE course_unit (
  id                    BIGINT PRIMARY KEY AUTO_INCREMENT,
  code                  VARCHAR(32)  NOT NULL,
  name                  VARCHAR(128) NOT NULL,
  semester              VARCHAR(16)  NOT NULL,
  start_date            DATE         NOT NULL,
  end_date              DATE         NOT NULL,
  total_budget_hours    DECIMAL(6,2) NOT NULL,
  remaining_budget      DECIMAL(6,2) NOT NULL,
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_semester (semester),
  KEY idx_code_sem (code, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 导师分配表
CREATE TABLE tutor_assignment (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  tutor_id     BIGINT NOT NULL,
  unit_id      BIGINT NOT NULL,
  pay_rate     DECIMAL(8,2) NOT NULL,
  quota_hours  DECIMAL(6,2) NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ta_tutor  FOREIGN KEY (tutor_id) REFERENCES user(id),
  CONSTRAINT fk_ta_unit   FOREIGN KEY (unit_id)  REFERENCES course_unit(id),
  UNIQUE KEY uk_tutor_unit (tutor_id, unit_id),
  KEY idx_unit (unit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 工时记录表
CREATE TABLE work_entry (
  id                 BIGINT PRIMARY KEY AUTO_INCREMENT,
  tutor_id           BIGINT      NOT NULL,
  unit_id            BIGINT      NOT NULL,
  week_start         DATE        NOT NULL,
  hours              DECIMAL(4,2) NOT NULL,
  work_type          VARCHAR(32)  NOT NULL,
  description        TEXT NULL,
  pay_rate_snapshot  DECIMAL(8,2) NOT NULL,
  status             ENUM('DRAFT','SUBMITTED','APPROVED_BY_LECTURER','APPROVED_BY_TUTOR','FINAL_APPROVED','REJECTED') NOT NULL,
  version            INT          NOT NULL DEFAULT 0,
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_we_tutor FOREIGN KEY (tutor_id) REFERENCES user(id),
  CONSTRAINT fk_we_unit  FOREIGN KEY (unit_id)  REFERENCES course_unit(id),
  UNIQUE KEY uk_tutor_unit_week (tutor_id, unit_id, week_start),
  KEY idx_unit_status (unit_id, status),
  KEY idx_tutor_week (tutor_id, week_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 审批任务表
CREATE TABLE approval_task (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  entry_id    BIGINT NOT NULL,
  step        ENUM('LECTURER','TUTOR','HR') NOT NULL,
  action      ENUM('APPROVE','REJECT') NOT NULL,
  comment     TEXT NULL,
  actor_id    BIGINT NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_at_entry FOREIGN KEY (entry_id) REFERENCES work_entry(id),
  CONSTRAINT fk_at_actor FOREIGN KEY (actor_id) REFERENCES user(id),
  KEY idx_entry_step (entry_id, step),
  KEY idx_actor_time (actor_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 预算流水表
CREATE TABLE budget_ledger (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  unit_id       BIGINT NOT NULL,
  delta_hours   DECIMAL(6,2) NOT NULL,  -- 预占为负，释放为正
  balance       DECIMAL(6,2) NOT NULL,  -- 剩余预算快照
  ref_table     VARCHAR(32)  NOT NULL,  -- 关联表（如 work_entry）
  ref_id        BIGINT       NOT NULL,
  reason        VARCHAR(64)  NOT NULL,  -- 'SUBMIT'/'REJECT'/'FINAL_APPROVED'/'ADJUST'
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bl_unit FOREIGN KEY (unit_id) REFERENCES course_unit(id),
  KEY idx_unit_time (unit_id, created_at),
  KEY idx_ref (ref_table, ref_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 审计日志表
CREATE TABLE audit_log (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  actor         BIGINT       NOT NULL,
  actor_role    ENUM('Lecturer','Tutor','HR','Admin') NOT NULL,
  action        VARCHAR(64)  NOT NULL,
  resource_type VARCHAR(64)  NOT NULL,
  resource_id   BIGINT       NOT NULL,
  before_data   JSON NULL,
  after_data    JSON NULL,
  ip            VARCHAR(45)  NULL,
  ua            VARCHAR(256) NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_resource (resource_type, resource_id),
  KEY idx_actor_time (actor, created_at),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
