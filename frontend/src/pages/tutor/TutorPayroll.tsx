import React, { useEffect, useState } from 'react';
import {
  Card,
  DatePicker,
  Table,
  Statistic,
  Row,
  Col,
  message,
  Space,
  Tabs,
} from 'antd';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { getTutorMonthlyIncome, getTutorMonthlyIncomeDetail } from '@/services/tutor/payrollService';
import { useIntl } from '@umijs/max';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const { TabPane } = Tabs;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9933FF'];

const TutorPayrollPage: React.FC = () => {
  const intl = useIntl();

  const [summary, setSummary] = useState<API.TutorIncome | null>(null);
  const [details, setDetails] = useState<API.TutorIncomeDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  /** 查询工资汇总 */
  const fetchSummary = async (month?: string) => {
    setLoading(true);
    try {
      const summaryData = await getTutorMonthlyIncome(month);
      setSummary(summaryData);
    } catch {
      message.error(intl.formatMessage({ id: 'tutor.payroll.data.error' }));
    } finally {
      setLoading(false);
    }
  };

  /** 查询收入明细 */
  const fetchDetails = async (month: string) => {
    try {
      const detailData = await getTutorMonthlyIncomeDetail(month);
      setDetails(detailData);
    } catch {
      message.error(intl.formatMessage({ id: 'tutor.payroll.detail.error' }));
    }
  };

  /** 初始化加载 */
  useEffect(() => {
    const m = selectedMonth.format('YYYY-MM');
    fetchSummary(m);
    fetchDetails(m);
  }, []);

  /** 切换月份时刷新 */
  const handleMonthChange = (v: dayjs.Dayjs | null) => {
    if (v) {
      setSelectedMonth(v);
      const m = v.format('YYYY-MM');
      fetchSummary(m);
      fetchDetails(m);
    }
  };

  /** 明细表列 */
  const detailColumns: ColumnsType<API.TutorIncomeDetail> = [
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.unitCode' }), dataIndex: 'unitCode', key: 'unitCode' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.unitName' }), dataIndex: 'unitName', key: 'unitName' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.taskName' }), dataIndex: 'taskName', key: 'taskName' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.weekStart' }), dataIndex: 'weekStart', key: 'weekStart' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.hours' }), dataIndex: 'hours', key: 'hours' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.payRate' }), dataIndex: 'payRate', key: 'payRate', render: (v) => `$${v}` },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.amount' }), dataIndex: 'amount', key: 'amount', render: (v) => `$${v}` },
  ];

  /** 图表数据处理 */
  const courseData = details.reduce((acc: Record<string, number>, cur) => {
    acc[cur.unitName] = (acc[cur.unitName] || 0) + cur.amount;
    return acc;
  }, {});
  const chartData = Object.entries(courseData).map(([name, value]) => ({ name, value }));

  /** 按课程统计 */
  const totalByCourse = Object.keys(courseData).map((key) => ({
    name: key,
    value: courseData[key],
  }));

  return (
    <Card title={intl.formatMessage({ id: 'tutor.payroll.page.title' })} bordered={false}>
      <Tabs defaultActiveKey="1">
        {/* 📄 Tab 1：明细视图 */}
        <TabPane tab={intl.formatMessage({ id: 'tutor.payroll.tab.detail' })} key="1">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <DatePicker
              picker="month"
              allowClear={false}
              value={selectedMonth}
              onChange={handleMonthChange}
            />

            {summary && (
              <Row gutter={16}>
                <Col span={8}>
                  <Card><Statistic title={intl.formatMessage({ id: 'tutor.payroll.card.month' })} value={summary.month} /></Card>
                </Col>
                <Col span={8}>
                  <Card><Statistic title={intl.formatMessage({ id: 'tutor.payroll.card.totalHours' })} value={summary.totalHours} suffix="h" /></Card>
                </Col>
                <Col span={8}>
                  <Card><Statistic title={intl.formatMessage({ id: 'tutor.payroll.card.totalIncome' })} value={summary.totalIncome} prefix="$" precision={2} /></Card>
                </Col>
              </Row>
            )}

            <Card
              title={intl.formatMessage(
                { id: 'tutor.payroll.detail.tableTitle' },
                { month: selectedMonth.format('YYYY-MM') },
              )}
              bordered
            >
              <Table
                columns={detailColumns}
                dataSource={details}
                loading={loading}
                pagination={{ pageSize: 6 }}
                rowKey="entryId"
              />
            </Card>
          </Space>
        </TabPane>

        {/* 📊 Tab 2：统计可视化 */}
        <TabPane tab={intl.formatMessage({ id: 'tutor.payroll.tab.analytics' })} key="2">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <DatePicker
              picker="month"
              allowClear={false}
              value={selectedMonth}
              onChange={handleMonthChange}
            />

            <Row gutter={16}>
              {/* 饼图：各课程薪酬占比 */}
              <Col span={12}>
                <Card title={intl.formatMessage({ id: 'tutor.payroll.chart.courseShare' })}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={totalByCourse}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {totalByCourse.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              {/* 柱状图：每个课程对应薪酬 */}
              <Col span={12}>
                <Card title={intl.formatMessage({ id: 'tutor.payroll.chart.courseIncome' })}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" name={intl.formatMessage({ id: 'tutor.payroll.totalIncome' })} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </Space>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TutorPayrollPage;
