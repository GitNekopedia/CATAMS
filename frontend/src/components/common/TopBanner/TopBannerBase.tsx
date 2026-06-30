import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Avatar } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { currentUser as fetchCurrentUser } from "@/services/auth/auth";
import { getGreeting } from '@/utils/greeting';
import { useIntl } from '@umijs/max';

const { Title, Text } = Typography;

type Props<T extends API.BaseOverview> = {
  role: 'LECTURER' | 'TUTOR';
  overview: T | null;
};

const TopBannerBase = <T extends API.BaseOverview>({ role, overview }: Props<T>) => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const intl = useIntl();
  const avatarSeed = ['Lucy', 'Foxy', 'Milo', 'Bunny', 'Sunny'][Math.floor(Math.random() * 5)];

  useEffect(() => {
    fetchCurrentUser()
      .then((res) => {
        if (res) setUser(res); // ✅ 拦截器返回的是 data.data，本身就是 user 对象
      })
      .catch(console.error);
  }, []);


  const greeting = getGreeting();

  // 防御性解构
  const {
    courseCount = 0,
    pendingCount = 0,
    approvedCount = 0,
    approvalRate = 0,
  } = overview || {};

  // 讲师 / 助教 第三项不同
  const thirdStat =
    role === 'LECTURER'
      ? {
        title: intl.formatMessage({ id: 'topBanner.stat.budgetUsage' }),
        value: (overview as API.LecturerOverView | null)?.averageBudgetUsage ?? 0,
        suffix: '%',
      }
      : {
        title: intl.formatMessage({ id: 'topBanner.stat.approvalRate' }),
        value: approvalRate ?? 0,
        suffix: '%',
      };

  // ✅ 统一样式
  const statTitleStyle: React.CSSProperties = {
    color: "black",
    fontSize: 16,
    fontWeight: 500,
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    textAlign: 'center',
    lineHeight: 1.3,
    minHeight: 36, // 与 StatCards 对齐
  };

  const statValueStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 600,
  };

  return (
    <Card>
      <Row justify="space-between" align="middle">
        {/* 左侧问候语 */}
        <Col flex="auto">
          <Row align="middle">
            <Avatar
              src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=Luna"
              size={64}
              icon={<SmileOutlined />}
              style={{ marginRight: 16 }}
            />
            <div>
              <Title level={4} style={{ marginBottom: 4 }}>
                {intl.formatMessage(
                  { id: 'topBanner.greeting' },
                  {
                    greeting,
                    name: user?.name || intl.formatMessage({ id: 'navbar.user.default' }),
                  }
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

        {/* 右侧三项指标 */}
        <Col flex="none">
          <Row gutter={[24, 0]} justify="center">
            <Col style={{ width: 140, textAlign: 'center' }}>
              <Statistic
                title={<div style={statTitleStyle}>{intl.formatMessage({ id: 'topBanner.stat.courses' })}</div>}
                value={courseCount}
                valueStyle={statValueStyle}
              />
            </Col>
            <Col style={{ width: 140, textAlign: 'center' }}>
              <Statistic
                title={<div style={statTitleStyle}>{intl.formatMessage({ id: 'topBanner.stat.pendingApprovals' })}</div>}
                value={pendingCount}
                valueStyle={statValueStyle}
              />
            </Col>
            <Col style={{ width: 140, textAlign: 'center' }}>
              <Statistic
                title={<div style={statTitleStyle}>{thirdStat.title}</div>}
                value={thirdStat.value}
                valueStyle={statValueStyle}
                suffix={thirdStat.suffix}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default TopBannerBase;
