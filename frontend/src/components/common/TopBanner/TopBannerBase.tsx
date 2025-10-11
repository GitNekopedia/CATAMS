import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Avatar } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { currentUser as fetchCurrentUser } from "@/services/auth/auth";
import { getGreeting } from '@/utils/greeting';
import { useIntl } from '@umijs/max';

const { Title, Text } = Typography;

type Props = {
  role: 'LECTURER' | 'TUTOR';
  coursesCount: number;
};

const TopBannerBase: React.FC<Props> = ({ role, coursesCount }) => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const intl = useIntl();

  useEffect(() => {
    fetchCurrentUser()
      .then(res => {
        if (res.success) setUser(res.data);
      })
      .catch(console.error);
  }, []);

  const greeting = getGreeting();

  return (
    <Card>
      <Row justify="space-between" align="middle">
        <Col>
          <Row align="middle">
            <Avatar
              src="https://gw.alipayobjects.com/zos/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              size={64}
              icon={<SmileOutlined />}
              style={{ marginRight: 16 }}
            />
            <div>
              <Title level={4}>
                {intl.formatMessage(
                  { id: 'topBanner.greeting' },
                  { greeting, name: user?.name || intl.formatMessage({ id: 'navbar.user.default' }) }
                )}
              </Title>
              <Text type="secondary">
                {role === 'LECTURER'
                  ? intl.formatMessage({ id: 'topBanner.role.lecturer' })
                  : intl.formatMessage({ id: 'topBanner.role.tutor' })}
              </Text>
            </div>
          </Row>
        </Col>
        <Col>
          <Row gutter={32}>
            <Col>
              <Statistic
                title={intl.formatMessage({ id: 'topBanner.stat.courses' })}
                value={coursesCount}
              />
            </Col>
            <Col>
              <Statistic
                title={intl.formatMessage({ id: 'topBanner.stat.rank' })}
                value="8 / 24"
              />
            </Col>
            <Col>
              <Statistic
                title={intl.formatMessage({ id: 'topBanner.stat.visits' })}
                value={2223}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default TopBannerBase;
