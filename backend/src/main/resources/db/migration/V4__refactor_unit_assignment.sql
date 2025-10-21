-- ==========================================================
-- V4__refactor_unit_assignment.sql
-- 功能：重构 unit_assignment 表
-- 目标：
--   1. 移除静态 pay_rate（薪酬已由 unit_task_type 定义）
--   2. 保留 quota_hours，作为计划工时聚合值
--   3. 新增 actual_hours 与 actual_pay_total，用于记录审批通过的真实数据
-- 作者：Hao Zhang
-- 日期：2025-10-20
-- ==========================================================

SET NAMES utf8mb4;

-- ==========================================================
-- 1) 移除旧字段 pay_rate
-- ==========================================================
ALTER TABLE unit_assignment
  DROP COLUMN pay_rate;

-- ==========================================================
-- 2) 修改 quota_hours 说明（改为聚合计算字段）
-- ==========================================================
ALTER TABLE unit_assignment
  MODIFY COLUMN quota_hours DECIMAL(6,2) NULL COMMENT '计划工时总和（由 planned_task_allocation 聚合）';

-- ==========================================================
-- 3) 新增两个快照字段：actual_hours 与 actual_pay_total
-- ==========================================================
ALTER TABLE unit_assignment
  ADD COLUMN actual_hours DECIMAL(6,2) NULL DEFAULT 0 COMMENT '实际审批通过的工时（来自 work_entry）' AFTER quota_hours,
  ADD COLUMN actual_pay_total DECIMAL(10,2) NULL DEFAULT 0 COMMENT '实际已审批薪酬总额（来自 work_entry）' AFTER actual_hours;

-- ==========================================================
-- 4) 立即初始化 quota_hours（计划工时总和）
-- ==========================================================
UPDATE unit_assignment ua
SET quota_hours = (
    SELECT IFNULL(SUM(planned_hours),0)
    FROM planned_task_allocation pta
    JOIN unit_task ut ON pta.task_id = ut.id
    WHERE ut.unit_id = ua.unit_id AND pta.tutor_id = ua.user_id
);

-- ==========================================================
-- 5) 初始化 actual_hours 与 actual_pay_total（实际工时与薪酬）
-- ==========================================================
UPDATE unit_assignment ua
SET
  actual_hours = (
    SELECT IFNULL(SUM(we.hours),0)
    FROM work_entry we
    WHERE we.unit_id = ua.unit_id
      AND we.tutor_id = ua.user_id
      AND we.status = 'FINAL_APPROVED'
  ),
  actual_pay_total = (
    SELECT IFNULL(SUM(we.hours * we.pay_rate_snapshot),0)
    FROM work_entry we
    WHERE we.unit_id = ua.unit_id
      AND we.tutor_id = ua.user_id
      AND we.status = 'FINAL_APPROVED'
  );

-- ==========================================================
-- END OF MIGRATION
-- ==========================================================
