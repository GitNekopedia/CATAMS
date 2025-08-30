import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col } from 'antd';

type Props = {
  topBanner: React.ReactNode;   // 顶部区域
  main: React.ReactNode;        // 左边主区域（课程卡片、活动）
  side: React.ReactNode;        // 右边侧边栏（统计卡片等）
};

const DashboardLayout: React.FC<Props> = ({ topBanner, main, side }) => {
  return (
    <PageContainer>
      {topBanner}
      <Row gutter={[24, 24]}>
        <Col span={16}>{main}</Col>
        <Col span={8}>{side}</Col>
      </Row>
    </PageContainer>
  );
};

export default DashboardLayout;
