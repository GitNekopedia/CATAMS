import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import CourseCardsBase from './CourseCardsBase';
import TutorCourse = API.TutorCourse;

type Props = {
  courses: TutorCourse[];
};

const CourseCardsTutor: React.FC<Props> = ({ courses }) => {
  const columns: ColumnsType<TutorCourse> = [
    { title: '课程代码', dataIndex: 'code', key: 'code' },
    { title: '课程名称', dataIndex: 'name', key: 'name' },
    { title: '工资标准 ($/hr)', dataIndex: 'payRate', key: 'payRate' },
    { title: '工时配额 (hrs)', dataIndex: 'quotaHours', key: 'quotaHours' },
  ];

  const renderMeta = (course: TutorCourse) => (
    <div>
      <div>课程代码: {course.code}</div>
      <div>课程名称: {course.name}</div>
      <div>工资标准: ${course.payRate}/hr</div>
      <div>工时配额: {course.quotaHours} hrs</div>
    </div>
  );

  return (
    <CourseCardsBase<TutorCourse>
      title="我参与的课程"
      courses={courses}
      columns={columns}
      renderMeta={renderMeta}
    />
  );
};

export default CourseCardsTutor;
