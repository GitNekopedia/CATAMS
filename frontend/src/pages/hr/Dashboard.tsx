import { useEffect, useState } from 'react';
import { message, Card, Row, Col, Statistic, Button } from 'antd';
import { useIntl, history } from '@umijs/max';
import { getHrOverview } from '@/services/hr/dashboardService';
import DashboardLayout from '@/components/common/DashboardLayout';

const HRDashboard: React.FC = () => {
  const intl = useIntl();
  const [overview, setOverview] = useState<API.HrOverview | null>(null);
  const [loading, setLoading] = useState(false);

  /** 初始化加载 */
  useEffect(() => {
    fetchOverview();
  }, []);

  /** ✅ 获取 HR 概览 */
  const fetchOverview = async () => {
    setLoading(true);
    try {
      const data = await getHrOverview();
      setOverview(data);
    } catch {
      message.error(intl.formatMessage({ id: 'hr.dashboard.loadFail' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      topBanner={
        <div style={{ marginBottom: 24 }}>
          <Card title={intl.formatMessage({ id: 'hr.dashboard.title' })} bordered={false}>
            <p>{intl.formatMessage({ id: 'hr.dashboard.welcome' })}</p>
          </Card>
        </div>
      }
      main={
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card>
              <Statistic
                title={intl.formatMessage({ id: 'hr.dashboard.totalCourses' })}
                value={overview?.totalCourses || 0}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={intl.formatMessage({ id: 'hr.dashboard.totalTutors' })}
                value={overview?.totalTutors || 0}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={intl.formatMessage({ id: 'hr.dashboard.pendingApprovals' })}
                value={overview?.pendingApprovals || 0}
              />
            </Card>
          </Col>

          <Col span={24}>
            <Card title={intl.formatMessage({ id: 'hr.dashboard.quickActions' })}>
              <Row gutter={[16, 16]}>
                <Col>
                  <Button type="primary" onClick={() => history.push('/hr/course-management')}>
                    {intl.formatMessage({ id: 'hr.dashboard.action.course' })}
                  </Button>
                </Col>
                <Col>
                  <Button onClick={() => history.push('/hr/user-management')}>
                    {intl.formatMessage({ id: 'hr.dashboard.action.user' })}
                  </Button>
                </Col>
                <Col>
                  <Button onClick={() => history.push('/hr/payroll')}>
                    {intl.formatMessage({ id: 'hr.dashboard.action.payroll' })}
                  </Button>
                </Col>
                <Col>
                  <Button onClick={() => history.push('/hr/work-entries')}>
                    {intl.formatMessage({ id: 'hr.dashboard.action.approval' })}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      }
    />
  );
};

export default HRDashboard;
