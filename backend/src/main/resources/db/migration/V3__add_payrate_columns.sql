-- ==========================================================
-- V3__add_payrate_columns.sql
-- 功能：为每个任务类型（unit_task_type）增加 PhD 与 Non-PhD 薪酬字段，
--      并在任务分配表（planned_task_allocation）记录选择的薪酬类别与快照。
-- 作者：Hao Zhang
-- 日期：2025-10-20
-- ==========================================================

SET NAMES utf8mb4;

-- ==========================================================
-- 1) 为任务类型表新增两类薪酬字段
-- ==========================================================
ALTER TABLE unit_task_type
  ADD COLUMN phd_pay_rate     DECIMAL(8,2) NULL COMMENT 'PhD 薪酬标准（$/hour）' AFTER name,
  ADD COLUMN non_phd_pay_rate DECIMAL(8,2) NULL COMMENT 'Non-PhD 薪酬标准（$/hour）' AFTER phd_pay_rate;

-- ==========================================================
-- 2) 为计划任务分配表新增选用薪酬类别与快照
-- ==========================================================
ALTER TABLE planned_task_allocation
  ADD COLUMN pay_category ENUM('PHD','NON_PHD') NOT NULL DEFAULT 'NON_PHD' COMMENT '所选薪酬类别' AFTER planned_hours,
  ADD COLUMN pay_rate DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT '实际使用的薪酬（快照）' AFTER pay_category;

-- ==========================================================
-- 3) 示例初始化：为已有任务类型设置默认薪酬标准
-- ==========================================================
UPDATE unit_task_type
SET phd_pay_rate = 65.00,
    non_phd_pay_rate = 55.00;

-- ==========================================================
-- 4) 示例：更新 planned_task_allocation 的快照（若已有数据）
-- ==========================================================
UPDATE planned_task_allocation pta
JOIN unit_task ut ON pta.task_id = ut.id
JOIN unit_task_type utt ON ut.type_id = utt.id
SET pta.pay_rate = CASE pta.pay_category
                      WHEN 'PHD' THEN utt.phd_pay_rate
                      ELSE utt.non_phd_pay_rate
                   END;

-- ==========================================================
-- END OF MIGRATION
-- ==========================================================
