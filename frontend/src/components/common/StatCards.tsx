import { Card, Col, Row } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';
import StatData = API.StatData;

type Props = {
  stats: StatData;
};

const StatCards: React.FC<Props> = ({ stats }) => {
  const intl = useIntl();

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card title={intl.formatMessage({ id: 'statCards.submittedHours' })}>
          {stats.workCount}
        </Card>
      </Col>
      <Col span={8}>
        <Card title={intl.formatMessage({ id: 'statCards.remainingBudget' })}>
          {stats.remainingBudget}
        </Card>
      </Col>
      <Col span={8}>
        <Card title={intl.formatMessage({ id: 'statCards.approvalRate' })}>
          {stats.approvalProgress}%
        </Card>
      </Col>
    </Row>
  );
};

export default StatCards;
