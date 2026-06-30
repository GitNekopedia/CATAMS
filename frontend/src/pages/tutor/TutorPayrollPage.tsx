import React, { useEffect, useState } from 'react';
import { Card, Tabs, DatePicker, Space, message } from 'antd';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';
import { getTutorMonthlyIncome, getTutorMonthlyIncomeDetail, getTutorYearlyIncome } from '@/services/tutor/payrollService';
import MonthlySummaryChart from './components/MonthlySummaryChart';
import YearlyTrendChart from './components/YearlyTrendChart';
import IncomeDetailTable from './components/IncomeDetailTable';
import YearlyDetailTable from './components/YearlyDetailTable';

const { TabPane } = Tabs;

const TutorPayrollPage: React.FC = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [summary, setSummary] = useState<API.TutorIncome | null>(null);
  const [details, setDetails] = useState<API.TutorIncomeDetail[]>([]);
  const [yearData, setYearData] = useState<API.TutorIncomeTrend[]>([]);
  const [loading, setLoading] = useState(false);

  /** 数据获取 */
  const fetchSummary = async (month?: string) => {
    setLoading(true);
    try {
      const data = await getTutorMonthlyIncome(month);
      setSummary(data);
    } catch {
      message.error(intl.formatMessage({ id: 'tutor.payroll.data.error' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (month: string) => {
    try {
      const data = await getTutorMonthlyIncomeDetail(month);
      setDetails(data);
    } catch {
      message.error(intl.formatMessage({ id: 'tutor.payroll.detail.error' }));
    }
  };

  const fetchYearData = async (year: string) => {
    try {
      const data = await getTutorYearlyIncome(year);
      setYearData(data);
    } catch {
      message.error(intl.formatMessage({ id: 'tutor.payroll.trend.error' }));
    }
  };

  /** 初始化加载 */
  useEffect(() => {
    const m = selectedMonth.format('YYYY-MM');
    fetchSummary(m);
    fetchDetails(m);
    fetchYearData(selectedMonth.format('YYYY'));
  }, []);

  const handleMonthChange = (v: dayjs.Dayjs | null) => {
    if (v) {
      setSelectedMonth(v);
      const m = v.format('YYYY-MM');
      fetchSummary(m);
      fetchDetails(m);
      fetchYearData(v.format('YYYY'));
    }
  };

  const currentYear = selectedMonth.format('YYYY');

  return (
    <Card title={intl.formatMessage({ id: 'tutor.payroll.page.title' })} bordered={false}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* 月度汇总 */}
        <TabPane tab={intl.formatMessage({ id: 'tutor.payroll.tab.summary' })} key="summary">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <DatePicker
              picker="month"
              allowClear={false}
              value={selectedMonth}
              onChange={handleMonthChange}
            />
            <MonthlySummaryChart
              summary={summary}
              details={details}
              loading={loading}
              selectedMonth={selectedMonth}
            />
          </Space>
        </TabPane>

        {/* 年度趋势 */}
        <TabPane tab={intl.formatMessage({ id: 'tutor.payroll.tab.trend' })} key="trend">
          <YearlyTrendChart yearData={yearData} year={currentYear} />
        </TabPane>

        {/* 年度明细 */}
        <TabPane tab={intl.formatMessage({ id: 'tutor.payroll.tab.yearDetail' })} key="yearDetail">
          <YearlyDetailTable yearData={yearData} year={currentYear} loading={loading} />
        </TabPane>

        {/* 工资明细 */}
        <TabPane tab={intl.formatMessage({ id: 'tutor.payroll.tab.detail' })} key="detail">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <DatePicker
              picker="month"
              allowClear={false}
              value={selectedMonth}
              onChange={handleMonthChange}
            />
            <IncomeDetailTable
              summary={summary}
              details={details}
              loading={loading}
              month={selectedMonth}
            />
          </Space>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TutorPayrollPage;
