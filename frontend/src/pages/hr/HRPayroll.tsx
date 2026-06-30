import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  DatePicker,
  Select,
  Row,
  Col,
  Statistic,
  Space,
  message,
  Button,
} from 'antd';
import { LeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { getUserList } from '@/services/hr/userService';
import { getHrMonthlyIncome, getHrMonthlyIncomeDetail } from '@/services/hr/payrollService';

const HRPayrollPage: React.FC = () => {
  const intl = useIntl();

  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(dayjs());
  const [tutors, setTutors] = useState<API.UserEntity[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<number | undefined>();
  const [data, setData] = useState<API.TutorIncome[]>([]);
  const [details, setDetails] = useState<API.TutorIncomeDetail[]>([]);

  /** ✅ 获取 Tutor 列表 */
  const fetchTutors = async () => {
    try {
      const tutors = await getUserList({ role: 'Tutor' }); // 拦截器返回纯业务数据
      setTutors(tutors || []);
    } catch {
      message.error(intl.formatMessage({ id: 'payroll.tutorList.error' }));
    }
  };

  /** ✅ 工资汇总 */
  const fetchData = async (m?: string, tutorId?: number) => {
    setLoading(true);
    try {
      const data = await getHrMonthlyIncome({ month: m, tutorId });
      setData(data || []);
    } catch {
      message.error(intl.formatMessage({ id: 'payroll.data.error' }));
    } finally {
      setLoading(false);
    }
  };

  /** ✅ 单个 Tutor 明细 */
  const fetchDetail = async (tutorId: number, monthStr: string) => {
    try {
      const details = await getHrMonthlyIncomeDetail({ month: monthStr, tutorId });
      setDetails(details || []);
    } catch {
      message.error(intl.formatMessage({ id: 'payroll.detail.error' }));
    }
  };

  /** ✅ 初始化加载 */
  useEffect(() => {
    fetchTutors();
    fetchData(month.format('YYYY-MM'));
  }, []);


  const totalIncome = data.reduce((sum, d) => sum + (d.totalIncome || 0), 0);
  const totalTutors = data.length;

  const summaryColumns: ColumnsType<API.TutorIncome> = [
    {
      title: intl.formatMessage({ id: 'payroll.table.tutorName' }),
      dataIndex: 'tutorName',
      key: 'tutorName',
    },
    {
      title: intl.formatMessage({ id: 'payroll.table.totalHours' }),
      dataIndex: 'totalHours',
      key: 'totalHours',
    },
    {
      title: intl.formatMessage({ id: 'payroll.table.totalIncome' }),
      dataIndex: 'totalIncome',
      key: 'totalIncome',
      render: (v: number) => `$${v.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({ id: 'payroll.table.action' }),
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          type="link"
          onClick={() => {
            setSelectedTutor(record.tutorId);
            fetchData(month.format('YYYY-MM'), record.tutorId);
            fetchDetail(record.tutorId, month.format('YYYY-MM'));
          }}
        >
          {intl.formatMessage({ id: 'payroll.button.viewDetail' })}
        </Button>
      ),
    },
  ];

  const detailColumns: ColumnsType<API.TutorIncomeDetail> = [
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.unitCode' }), dataIndex: 'unitCode', key: 'unitCode' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.unitName' }), dataIndex: 'unitName', key: 'unitName' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.taskName' }), dataIndex: 'taskName', key: 'taskName' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.weekStart' }), dataIndex: 'weekStart', key: 'weekStart' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.hours' }), dataIndex: 'hours', key: 'hours' },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.payRate' }), dataIndex: 'payRate', key: 'payRate', render: (v) => `$${v}` },
    { title: intl.formatMessage({ id: 'tutor.payroll.detail.amount' }), dataIndex: 'amount', key: 'amount', render: (v) => `$${v}` },
  ];

  /** ------------------------- 单人模式 ------------------------- */
  if (selectedTutor) {
    const tutorData = data[0];
    return (
      <Card
        title={intl.formatMessage({ id: 'payroll.page.title' })}
        bordered={false}
        extra={
          <Button
            icon={<LeftOutlined />}
            onClick={() => {
              setSelectedTutor(undefined);
              setDetails([]);
              fetchData(month.format('YYYY-MM'));
            }}
          >
            {intl.formatMessage({ id: 'payroll.button.backToAll' })}
          </Button>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space wrap>
            <DatePicker
              picker="month"
              allowClear={false}
              value={month}
              onChange={(v) => {
                if (v) {
                  setMonth(v);
                  fetchData(v.format('YYYY-MM'), selectedTutor);
                  fetchDetail(selectedTutor, v.format('YYYY-MM'));
                }
              }}
            />
            <Select
              placeholder={intl.formatMessage({ id: 'payroll.select.tutor' })}
              allowClear
              style={{ width: 220 }}
              options={tutors.map((t) => ({ label: t.name, value: t.id }))}
              value={selectedTutor}
              onChange={(v) => {
                if (v) {
                  setSelectedTutor(v);
                  fetchData(month.format('YYYY-MM'), v);
                  fetchDetail(v, month.format('YYYY-MM'));
                } else {
                  // 清空返回所有 tutor
                  setSelectedTutor(undefined);
                  setDetails([]);
                  fetchData(month.format('YYYY-MM'));
                }
              }}
            />
          </Space>

          {/* 汇总卡片 */}
          {tutorData && (
            <Row gutter={16}>
              <Col span={8}>
                <Card><Statistic title={intl.formatMessage({ id: 'payroll.card.month' })} value={tutorData.month} /></Card>
              </Col>
              <Col span={8}>
                <Card><Statistic title={intl.formatMessage({ id: 'payroll.card.totalHours' })} value={tutorData.totalHours} suffix="h" /></Card>
              </Col>
              <Col span={8}>
                <Card><Statistic title={intl.formatMessage({ id: 'payroll.card.totalIncome' })} value={tutorData.totalIncome} prefix="$" precision={2} /></Card>
              </Col>
            </Row>
          )}

          {/* 明细表 */}
          <Card
            title={`${tutorData?.tutorName || ''} - ${month.format('YYYY-MM')} ${intl.formatMessage({ id: 'payroll.detail.title' })}`}
            bordered
          >
            <Table
              columns={detailColumns}
              dataSource={details}
              pagination={{ pageSize: 6 }}
              rowKey="entryId"
            />
          </Card>
        </Space>
      </Card>
    );
  }

  /** ------------------------- 多人模式 ------------------------- */
  return (
    <Card title={intl.formatMessage({ id: 'payroll.page.title' })} bordered={false}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 筛选栏 */}
        <Space wrap>
          <DatePicker
            picker="month"
            allowClear={false}
            value={month}
            onChange={(v) => {
              if (v) {
                setMonth(v);
                fetchData(v.format('YYYY-MM'));
              }
            }}
          />
          <Select
            placeholder={intl.formatMessage({ id: 'payroll.select.tutor' })}
            allowClear
            style={{ width: 220 }}
            options={tutors.map((t) => ({ label: t.name, value: t.id }))}
            value={selectedTutor}
            onChange={(v) => {
              if (v) {
                setSelectedTutor(v);
                fetchData(month.format('YYYY-MM'), v);
                fetchDetail(v, month.format('YYYY-MM'));
              } else {
                // 清空时返回所有 tutor
                setSelectedTutor(undefined);
                setDetails([]);
                fetchData(month.format('YYYY-MM'));
              }
            }}
          />
        </Space>

        {/* 汇总卡片 */}
        <Row gutter={16}>
          <Col span={8}><Card><Statistic title={intl.formatMessage({ id: 'payroll.card.month' })} value={month.format('YYYY-MM')} /></Card></Col>
          <Col span={8}><Card><Statistic title={intl.formatMessage({ id: 'payroll.card.tutorCount' })} value={totalTutors} /></Card></Col>
          <Col span={8}><Card><Statistic title={intl.formatMessage({ id: 'payroll.card.totalCost' })} value={totalIncome} prefix="$" precision={2} /></Card></Col>
        </Row>

        {/* 汇总表 + 查看详情按钮 */}
        <Table
          columns={summaryColumns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 8 }}
          rowKey="tutorId"
        />
      </Space>
    </Card>
  );
};

export default HRPayrollPage;
