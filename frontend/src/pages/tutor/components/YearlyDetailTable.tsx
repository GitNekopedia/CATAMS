import React from 'react';
import { Card, Table } from 'antd';
import { useIntl } from '@umijs/max';
import type { ColumnsType } from 'antd/es/table';

const YearlyDetailTable: React.FC<{
  yearData: API.TutorIncomeTrend[];
  year: string;
  loading: boolean;
}> = ({ yearData, year, loading }) => {
  const intl = useIntl();

  const columns: ColumnsType<API.TutorIncomeTrend> = [
    {
      title: intl.formatMessage({ id: 'tutor.payroll.detail.month' }),
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: intl.formatMessage({ id: 'tutor.payroll.detail.totalHours' }),
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (v) => `${v.toFixed(1)} h`,
    },
    {
      title: intl.formatMessage({ id: 'tutor.payroll.detail.totalIncome' }),
      dataIndex: 'totalIncome',
      key: 'totalIncome',
      render: (v) => `$${v.toFixed(2)}`,
    },
  ];

  return (
    <Card
      title={`${year} ${intl.formatMessage({ id: 'tutor.payroll.yearDetail.title' })}`}
      bordered
    >
      <Table
        columns={columns}
        dataSource={yearData}
        loading={loading}
        rowKey="month"
        pagination={false}
      />
    </Card>
  );
};

export default YearlyDetailTable;
