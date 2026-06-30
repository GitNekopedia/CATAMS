-- ==========================================================
-- V5__relax_work_entry_unique_constraint.sql
-- 功能：移除 work_entry 上基于 (tutor_id, unit_id, task_id, week_start) 的唯一约束，
--      以便支持：
--      - 同一计划任务被多名 Tutor 代课
--      - REJECTED 之后按业务逻辑允许重新提交
-- 说明：重复校验改由业务层（SubmitWorkEntryHandler）控制。
-- 作者：Hao Zhang
-- 日期：2025-11-26
-- ==========================================================

SET NAMES utf8mb4;

-- ==========================================================
-- 1) 删除唯一索引 uk_tutor_unit_task_week
--    在 V1__init.sql 中定义为：
--    UNIQUE KEY uk_tutor_unit_task_week (tutor_id, unit_id, task_id, week_start)
-- ==========================================================
ALTER TABLE work_entry
  DROP INDEX uk_tutor_unit_task_week;
