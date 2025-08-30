// src/pages/tutor/dashboard/widgets/StatCards.tsx
import { Card, Col, Row, Statistic } from 'antd';

const StatCards: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic title="本月提交工时数" value={32} suffix="小时" />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="剩余预算" value={118.5} suffix="小时" />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="审批完成率" value={72} suffix="%" />
        </Card>
      </Col>
    </Row>
  );
};

export default StatCards;
