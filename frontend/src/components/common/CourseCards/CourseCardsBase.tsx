import React, { useState } from 'react';
import { Card, Avatar, Modal, Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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

  // 前 6 个课程
  const displayCourses = courses.slice(0, 6);
  // 如果不足 6 个，补空位
  const emptySlots = Array.from({ length: 6 - displayCourses.length }, (_, i) => i);

  return (
    <>
      <Card
        title={title}
        extra={<Button type="link" onClick={() => setOpen(true)}>全部课程</Button>}
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

        {/* 补齐空位 */}
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
            空
          </Card.Grid>
        ))}
      </Card>

      {/* 弹窗展示全部课程 */}
      <Modal
        title="我被分配的所有课程"
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
