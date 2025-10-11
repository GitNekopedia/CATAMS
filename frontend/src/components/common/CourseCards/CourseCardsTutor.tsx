import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import CourseCardsBase from './CourseCardsBase';
import TutorCourse = API.TutorCourse;
import { useIntl } from '@umijs/max';

type Props = {
  courses: TutorCourse[];
};

const CourseCardsTutor: React.FC<Props> = ({ courses }) => {
  const intl = useIntl();

  const columns: ColumnsType<TutorCourse> = [
    { title: intl.formatMessage({ id: 'courseCards.code' }), dataIndex: 'code', key: 'code' },
    { title: intl.formatMessage({ id: 'courseCards.name' }), dataIndex: 'name', key: 'name' },
    { title: intl.formatMessage({ id: 'courseCards.payRate' }), dataIndex: 'payRate', key: 'payRate' },
    { title: intl.formatMessage({ id: 'courseCards.quotaHours' }), dataIndex: 'quotaHours', key: 'quotaHours' },
  ];

  const renderMeta = (course: TutorCourse) => (
    <div>
      <div>{intl.formatMessage({ id: 'courseCards.code' })}: {course.code}</div>
      <div>{intl.formatMessage({ id: 'courseCards.name' })}: {course.name}</div>
      <div>{intl.formatMessage({ id: 'courseCards.payRate' })}: ${course.payRate}/hr</div>
      <div>{intl.formatMessage({ id: 'courseCards.quotaHours' })}: {course.quotaHours} hrs</div>
    </div>
  );

  return (
    <CourseCardsBase<TutorCourse>
      title={intl.formatMessage({ id: 'courseCards.tutor.title' })}
      courses={courses}
      columns={columns}
      renderMeta={renderMeta}
    />
  );
};

export default CourseCardsTutor;
