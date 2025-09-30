import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import CourseCardsBase from './CourseCardsBase';
import LecturerCourse = API.LecturerCourse;

type Props = {
  courses: LecturerCourse[];
};

const CourseCardsLecturer: React.FC<Props> = ({ courses }) => {
  const columns: ColumnsType<LecturerCourse> = [
    { title: '课程代码', dataIndex: 'code', key: 'code' },
    { title: '课程名称', dataIndex: 'name', key: 'name' },
    { title: '总预算（hrs）', dataIndex: 'totalBudgetHours', key: 'totalBudgetHours' },
    { title: '剩余预算（hrs）', dataIndex: 'remainingBudget', key: 'remainingBudget' },
  ];

  const renderMeta = (course: LecturerCourse) => (
    <div>
      <div>课程代码: {course.code}</div>
      <div>课程名称: {course.name}</div>
      <div>总预算: {course.totalBudgetHours} hrs</div>
      <div>剩余: {course.remainingBudget} hrs</div>
    </div>
  );

  return (
    <CourseCardsBase<LecturerCourse>
      title="已分配课程"
      courses={courses}
      columns={columns}
      renderMeta={renderMeta}
    />
  );
};

export default CourseCardsLecturer;
