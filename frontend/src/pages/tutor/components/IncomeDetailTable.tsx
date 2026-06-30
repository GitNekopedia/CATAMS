import React from 'react';
import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useIntl } from '@umijs/max';
import dayjs from "dayjs";

const IncomeDetailTable: React.FC<{
  summary: API.TutorIncome | null;
  details: API.TutorIncomeDetail[];
  loading: boolean;
  month: dayjs.Dayjs;
}> = ({ details, loading, month }) => {
  const intl = useIntl();

  const columns: ColumnsType<API.TutorIncomeDetail> = [
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.unitName' }), dataIndex: 'unitName' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.taskName' }), dataIndex: 'taskName' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.weekStart' }), dataIndex: 'weekStart' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.hours' }), dataIndex: 'hours' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.payRate' }), dataIndex: 'payRate', render: (v) => `$${v}` },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.amount' }), dataIndex: 'amount', render: (v) => `$${v}` },
  ];

  return (
    <Card
      title={`${month.format('YYYY-MM')} ${intl.formatMessage({ id: 'tutor.payroll.detail.tableTitle' })}`}
      bordered
    >
      <Table
        columns={columns}
        dataSource={details}
        loading={loading}
        pagination={{ pageSize: 6 }}
        rowKey="entryId"
      />
    </Card>
  );
};

export default IncomeDetailTable;
