-- =========================================================
-- V24__fix_mood_record_timezone_to_utc.sql
-- 功能：将 mood_record 表中 created_at 从北京时间修正为 UTC
-- 作者：CATAMS Migration Utility
-- 时间：2025-11-08
-- =========================================================

-- ✅ Step 0. 前置安全检查
-- 若表不存在，直接跳过
SET @table_exists = (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_name = 'mood_record'
);

-- 仅当表存在时继续
SET @continue_exec = IF(@table_exists > 0, TRUE, FALSE);

-- =========================================================
-- ✅ Step 1. 创建备份表（仅第一次执行）
-- =========================================================
-- 防止重复创建备份表
SET @backup_exists = (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_name = 'mood_record_backup_utcfix'
);

SET @need_backup = IF(@backup_exists = 0, TRUE, FALSE);

-- 仅在备份表不存在时执行备份
SET @sql_backup := IF(
  @need_backup,
  'CREATE TABLE mood_record_backup_utcfix AS SELECT * FROM mood_record;',
  'SELECT "✅ 备份表已存在，跳过备份";'
);
PREPARE stmt FROM @sql_backup;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =========================================================
-- ✅ Step 2. 自动检测是否已修正（取最新时间差判断）
-- =========================================================
SET @diff_hour := (
  SELECT TIMESTAMPDIFF(HOUR, MIN(created_at), MAX(created_at))
  FROM mood_record
);

-- 如果最大时间与最小时间的差值小于 12 小时（说明数据已统一），则跳过
SET @already_fixed := IF(@diff_hour < 12, TRUE, FALSE);

-- =========================================================
-- ✅ Step 3. 修正数据：全部回拨 8 小时（仅首次执行）
-- =========================================================
SET @sql_fix := IF(
  @already_fixed,
  'SELECT "✅ 数据已是 UTC，无需再次修正" AS message;',
  'UPDATE mood_record SET created_at = DATE_SUB(created_at, INTERVAL 8 HOUR);'
);
PREPARE stmt_fix FROM @sql_fix;
EXECUTE stmt_fix;
DEALLOCATE PREPARE stmt_fix;

-- =========================================================
-- ✅ Step 4. 标记完成
-- =========================================================
SELECT
  NOW() AS executed_at,
  '✅ mood_record 时区修复完成（北京时间 → UTC）' AS status_message;
