-- 初始化基础测试数据
-- 注意：这些数据仅用于开发调试环境

-- 插入用户（讲师、导师、HR、管理员）
INSERT INTO user (name, email, role) VALUES
('Alice', 'alice@uni.edu', 'Lecturer'),
('Bob',   'bob@uni.edu',   'Tutor'),
('Carol', 'carol@uni.edu', 'HR'),
('Admin', 'admin@uni.edu', 'Admin');

-- 插入课程
INSERT INTO course_unit (code, name, semester, start_date, end_date, total_budget_hours, remaining_budget)
VALUES
('COMP1010', 'Introduction to Computer Science', '2025S2', '2025-07-21', '2025-11-14', 100.0, 100.0),
('INFO5992', 'Advanced Software Engineering',     '2025S2', '2025-07-21', '2025-11-14', 120.0, 120.0);

-- 分配导师到课程
INSERT INTO tutor_assignment (tutor_id, unit_id, pay_rate, quota_hours)
VALUES
((SELECT id FROM user WHERE email='bob@uni.edu'),
 (SELECT id FROM course_unit WHERE code='COMP1010' AND semester='2025S2'),
 50.00, 40.00),
((SELECT id FROM user WHERE email='bob@uni.edu'),
 (SELECT id FROM course_unit WHERE code='INFO5992' AND semester='2025S2'),
 55.00, 50.00);

-- 模拟一条已提交的工时记录（Bob 在 COMP1010 第1周工作 10 小时）
INSERT INTO work_entry (tutor_id, unit_id, week_start, hours, work_type, description, pay_rate_snapshot, status, version)
VALUES
((SELECT id FROM user WHERE email='bob@uni.edu'),
 (SELECT id FROM course_unit WHERE code='COMP1010' AND semester='2025S2'),
 '2025-07-21', 10.0, 'Marking', 'Graded Assignment 1', 50.00, 'SUBMITTED', 0);

-- 对应的预算预占流水
INSERT INTO budget_ledger (unit_id, delta_hours, balance, ref_table, ref_id, reason)
VALUES
((SELECT id FROM course_unit WHERE code='COMP1010' AND semester='2025S2'),
 -10.0, 90.0, 'work_entry',
 (SELECT id FROM work_entry WHERE unit_id = (SELECT id FROM course_unit WHERE code='COMP1010' AND semester='2025S2') LIMIT 1),
 'SUBMIT');

-- 对应的审批任务（讲师已批准）
INSERT INTO approval_task (entry_id, step, action, comment, actor_id)
VALUES
((SELECT id FROM work_entry WHERE unit_id = (SELECT id FROM course_unit WHERE code='COMP1010' AND semester='2025S2') LIMIT 1),
 'LECTURER', 'APPROVE', 'OK', (SELECT id FROM user WHERE email='alice@uni.edu'));

-- 审计日志（记录状态变更）
INSERT INTO audit_log (actor, actor_role, action, resource_type, resource_id, before_data, after_data, ip, ua)
VALUES
((SELECT id FROM user WHERE email='alice@uni.edu'), 'Lecturer', 'UPDATE_STATUS', 'work_entry',
 (SELECT id FROM work_entry WHERE unit_id = (SELECT id FROM course_unit WHERE code='COMP1010' AND semester='2025S2') LIMIT 1),
 JSON_OBJECT('status','DRAFT'), JSON_OBJECT('status','SUBMITTED'), '127.0.0.1', 'Flyway Seed Script');
