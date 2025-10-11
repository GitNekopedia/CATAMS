import React, { useState } from 'react';
import { Card, Avatar, Modal, Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useIntl } from '@umijs/max';

const { Meta } = Card;

type Props<T> = {
  title: string;
  courses: T[];
  columns: ColumnsType<T>;
  renderMeta: (course: T) => React.ReactNode;
};

function CourseCardsBase<T extends { id: number }>({
                                                     title,
                                                     courses,
                                                     columns,
                                                     renderMeta,
                                                   }: Props<T>) {
  const [open, setOpen] = useState(false);
  const intl = useIntl();

  const displayCourses = courses.slice(0, 6);
  const emptySlots = Array.from({ length: 6 - displayCourses.length }, (_, i) => i);

  return (
    <>
      <Card
        title={title}
        extra={<Button type="link" onClick={() => setOpen(true)}>
          {intl.formatMessage({ id: 'courseCards.modalTitle' })}
        </Button>}
        style={{ marginBottom: 24 }}
      >
        {displayCourses.map((course) => (
          <Card.Grid
            key={course.id}
            style={{ width: '33.33%', minHeight: 150 }}
            hoverable
          >
            <Meta
              avatar={
                <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png" />
              }
              title={<a href={`/course/${course.id}`}>{/* 动态标题 */}</a>}
              description={renderMeta(course)}
            />
          </Card.Grid>
        ))}

        {emptySlots.map((i) => (
          <Card.Grid
            key={`empty-${i}`}
            style={{
              width: '33.33%',
              minHeight: 150,
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
            }}
          >
            {intl.formatMessage({ id: 'courseCards.empty' })}
          </Card.Grid>
        ))}
      </Card>

      <Modal
        title={intl.formatMessage({ id: 'courseCards.modalTitle' })}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={courses}
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </>
  );
}

export default CourseCardsBase;
