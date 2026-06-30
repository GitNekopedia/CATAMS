import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { useIntl } from '@umijs/max';
import dayjs from "dayjs";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9933FF'];

const MonthlySummaryChart: React.FC<{
  summary: API.TutorIncome | null;
  details: API.TutorIncomeDetail[];
  loading: boolean;
  selectedMonth: dayjs.Dayjs;
}> = ({ summary, details, loading, selectedMonth }) => {
  const intl = useIntl();

  const courseData = details.reduce((acc: Record<string, number>, cur) => {
    acc[cur.unitName] = (acc[cur.unitName] || 0) + cur.amount;
    return acc;
  }, {});
  const chartData = Object.entries(courseData).map(([name, value]) => ({ name, value }));

  return (
    <div>
      {summary && (
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title={intl.formatMessage({ id: 'tutor.payroll.card.month' })}
                value={summary.month}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={intl.formatMessage({ id: 'tutor.payroll.card.totalHours' })}
                value={summary.totalHours}
                suffix="h"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={intl.formatMessage({ id: 'tutor.payroll.card.totalIncome' })}
                value={summary.totalIncome}
                prefix="$"
                precision={2}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title={intl.formatMessage({ id: 'tutor.payroll.chart.courseShare' })}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={intl.formatMessage({ id: 'tutor.payroll.chart.courseIncome' })}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#82ca9d"
                  name={intl.formatMessage({ id: 'tutor.payroll.chart.courseIncome.label' })}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MonthlySummaryChart;
