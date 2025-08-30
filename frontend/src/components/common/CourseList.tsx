import React, { useEffect, useState } from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<API.CourseUnit[]>([]);

  // 模拟 API 调用，你之后可以替换成 request('/api/courses')
  useEffect(() => {
    async function fetchCourses() {
      // 假数据
      const data: API.CourseUnit[] = [
        { id: 1, code: 'COMP5348', name: 'Enterprise Architecture', totalBudgetHours: 100, remainingBudget: 40 },
        { id: 2, code: 'COMP5616', name: 'Security Engineering', totalBudgetHours: 80, remainingBudget: 50 },
      ];
      setCourses(data);
    }
    fetchCourses();
  }, []);

  const columns: ColumnsType<API.CourseUnit> = [
    {
      title: '课程代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '总预算（hrs）',
      dataIndex: 'totalBudgetHours',
      key: 'totalBudgetHours',
    },
    {
      title: '剩余预算（hrs）',
      dataIndex: 'remainingBudget',
      key: 'remainingBudget',
    },
  ];

  return (
    <Card title="我被分配的所有课程" style={{ margin: 24 }}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={courses}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default CourseList;
