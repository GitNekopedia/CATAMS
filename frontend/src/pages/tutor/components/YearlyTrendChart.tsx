import React from 'react';
import { Card } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useIntl } from '@umijs/max';

const YearlyTrendChart: React.FC<{
  yearData: API.TutorIncomeTrend[];
  year: string;
}> = ({ yearData, year }) => {
  const intl = useIntl();

  return (
    <Card
      title={`${year} ${intl.formatMessage({ id: 'tutor.payroll.chart.yearTrend' })}`}
      bordered
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={yearData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            label={{
              value: intl.formatMessage({ id: 'tutor.payroll.chart.axis.month' }),
              position: 'insideBottom',
              offset: -5,
            }}
          />
          <YAxis
            label={{
              value: intl.formatMessage({ id: 'tutor.payroll.chart.axis.income' }),
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip
            formatter={(value: number) => [
              `$${value.toFixed(2)}`,
              intl.formatMessage({ id: 'tutor.payroll.chart.tooltip.income' }),
            ]}
          />
          <Legend
            formatter={() =>
              intl.formatMessage({ id: 'tutor.payroll.chart.legend.income' })
            }
          />
          <Line
            type="monotone"
            dataKey="totalIncome"
            stroke="#82ca9d"
            name={intl.formatMessage({ id: 'tutor.payroll.chart.legend.income' })}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default YearlyTrendChart;
