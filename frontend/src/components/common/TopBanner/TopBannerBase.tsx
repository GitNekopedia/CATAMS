import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Avatar } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { currentUser as fetchCurrentUser } from "@/services/auth/auth";
import { getGreeting } from '@/utils/greeting';

const { Title, Text } = Typography;

type Props = {
  role: 'LECTURER' | 'TUTOR';
  coursesCount: number;
};

const TopBannerBase: React.FC<Props> = ({ role, coursesCount }) => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetchCurrentUser().then(res => {
      if (res.success) setUser(res.data);
    }).catch(console.error);
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
                {greeting}，{user?.name || '用户'}，祝你开心每一天！
              </Title>
              <Text type="secondary">
                {role === 'LECTURER' ? '课程负责人 | CATAMS 平台' : '助教 | CATAMS 平台'}
              </Text>
            </div>
          </Row>
        </Col>
        <Col>
          <Row gutter={32}>
            <Col>
              <Statistic title="课程数" value={coursesCount} />
            </Col>
            <Col>
              <Statistic title="团队内排名" value="8 / 24" />
            </Col>
            <Col>
              <Statistic title="项目访问" value={2223} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default TopBannerBase;
