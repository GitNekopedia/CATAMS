import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import CourseCardsBase from './CourseCardsBase';
import LecturerCourse = API.LecturerCourse;
import { useIntl } from '@umijs/max';

type Props = {
  courses: LecturerCourse[];
};

const CourseCardsLecturer: React.FC<Props> = ({ courses }) => {
  const intl = useIntl();

  const columns: ColumnsType<LecturerCourse> = [
    { title: intl.formatMessage({ id: 'courseCards.code' }), dataIndex: 'code', key: 'code' },
    { title: intl.formatMessage({ id: 'courseCards.name' }), dataIndex: 'name', key: 'name' },
    { title: intl.formatMessage({ id: 'courseCards.totalBudget' }), dataIndex: 'totalBudgetHours', key: 'totalBudgetHours' },
    { title: intl.formatMessage({ id: 'courseCards.remainingBudget' }), dataIndex: 'remainingBudget', key: 'remainingBudget' },
  ];

  const renderMeta = (course: LecturerCourse) => (
    <div>
      <div>{intl.formatMessage({ id: 'courseCards.code' })}: {course.code}</div>
      <div>{intl.formatMessage({ id: 'courseCards.name' })}: {course.name}</div>
      <div>{intl.formatMessage({ id: 'courseCards.totalBudget' })}: {course.totalBudgetHours} hrs</div>
      <div>{intl.formatMessage({ id: 'courseCards.remainingBudget' })}: {course.remainingBudget} hrs</div>
    </div>
  );

  return (
    <CourseCardsBase<LecturerCourse>
      title={intl.formatMessage({ id: 'courseCards.lecturer.title' })}
      courses={courses}
      columns={columns}
      renderMeta={renderMeta}
    />
  );
};

export default CourseCardsLecturer;
