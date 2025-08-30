import { Card, Col, Row } from 'antd';
import React from 'react';
import StatData = API.StatData;


type Props = {
  stats: StatData;
};


const StatCards: React.FC<Props> = ({ stats }) => {
  return (
    <Row gutter={16}>
      <Col span={8}><Card title="Submitted Hours">{stats.workCount}</Card></Col>
      <Col span={8}><Card title="Remaining Budget">{stats.remainingBudget}</Card></Col>
      <Col span={8}><Card title="Approval Rate">{stats.approvalProgress}%</Card></Col>
    </Row>
  );
};


export default StatCards;
