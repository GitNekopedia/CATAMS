import { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Typography, Avatar } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import {currentUser as fetchCurrentUser} from "@/services/auth/auth";
import { getGreeting } from '@/utils/greeting';
import CourseUnit = API.CourseUnit;

const { Title, Text } = Typography;

type Props = {
  courses: CourseUnit[];
};

const TopBanner: React.FC<Props> = ({courses}) => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const coursesCount = courses.length;
  console.log(coursesCount);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchCurrentUser();
        if (res.success) {
          setUser(res.data);
        }
      } catch (e) {
        console.error('Failed to fetch user info', e);
      }
    };
    fetchData();
  }, []);

  const greeting = getGreeting(); // "早安", "下午好", etc

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
              <Text type="secondary">交互专家 | CATAMS 平台</Text>
            </div>
          </Row>
        </Col>
        <Col>
          <Row gutter={32}>
            <Col>
              <Statistic title="项目数" value={coursesCount} />
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

export default TopBanner;
