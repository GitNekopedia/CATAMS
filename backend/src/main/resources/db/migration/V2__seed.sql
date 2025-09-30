-- V2__seed.sql
-- 初始化基础数据：1 Tutor, 1 Lecturer, 1 HR + 三门课程 + 课程分配

SET NAMES utf8mb4;

-- 用户
INSERT INTO user (name, email, role) VALUES
('Alice Tutor', 'alice.tutor@example.com', 'Tutor'),
('Bob Lecturer', 'bob.lecturer@example.com', 'Lecturer'),
('Carol HR', 'carol.hr@example.com', 'HR');

-- 课程
INSERT INTO course_unit (code, name, semester, start_date, end_date, total_budget_hours, remaining_budget) VALUES
('COMP5348', 'Enterprise Architecture', '2025S1', '2025-03-01', '2025-06-30', 100.00, 100.00),
('COMP5349', 'Cloud Computing',          '2025S1', '2025-03-01', '2025-06-30', 120.00, 120.00),
('COMP5350', 'Big Data Systems',         '2025S1', '2025-03-01', '2025-06-30', 80.00,  80.00);

-- 课程分配
-- 三门课程都分配给 Tutor (Alice) 和 Lecturer (Bob)
-- Tutor 分配工时和工资
INSERT INTO unit_assignment (unit_id, user_id, role, pay_rate, quota_hours) VALUES
(1, 1, 'TUTOR', 50.00, 40.00),
(2, 1, 'TUTOR', 55.00, 50.00),
(3, 1, 'TUTOR', 60.00, 30.00);

-- Lecturer 分配
INSERT INTO unit_assignment (unit_id, user_id, role) VALUES
(1, 2, 'LECTURER'),
(2, 2, 'LECTURER'),
(3, 2, 'LECTURER');
