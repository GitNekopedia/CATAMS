import React, { useState } from 'react';
import { Card, Avatar, Modal, Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import CourseUnit = API.CourseUnit;

const { Meta } = Card;

type Props = {
  courses: CourseUnit[];
};

const CourseCards: React.FC<Props> = ({ courses }) => {
  const [open, setOpen] = useState(false);

  // 前 6 个课程
  const displayCourses = courses.slice(0, 6);
  // 如果不足 6 个，补空位
  const emptySlots = Array.from({ length: 6 - displayCourses.length }, (_, i) => i);

  // 表格列定义（支持排序）
  const columns: ColumnsType<CourseUnit> = [
    {
      title: '课程代码',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code), // 按字符串排序
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '总预算（hrs）',
      dataIndex: 'totalBudgetHours',
      key: 'totalBudgetHours',
      sorter: (a, b) => a.totalBudgetHours - b.totalBudgetHours, // 数字排序
    },
    {
      title: '剩余预算（hrs）',
      dataIndex: 'remainingBudget',
      key: 'remainingBudget',
      sorter: (a, b) => a.remainingBudget - b.remainingBudget, // 数字排序
    },
  ];

  return (
    <>
      <Card
        title="已分配课程"
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
              title={<a href={`/course/${course.id}`}>{course.name}</a>}
              description={
                <div>
                  <div>课程代码: {course.code}</div>
                  <div>总预算: {course.totalBudgetHours} hrs</div>
                  <div>剩余: {course.remainingBudget} hrs</div>
                </div>
              }
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
};

export default CourseCards;
