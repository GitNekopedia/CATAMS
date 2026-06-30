import { Card, Col, Row } from 'antd';
import React from 'react';
import { useIntl } from '@umijs/max';
import LecturerOverView = API.LecturerOverView;
import TutorOverView = API.TutorOverView;

type Props = {
  overview: LecturerOverView | TutorOverView | null;
  role: 'LECTURER' | 'TUTOR';
};

const StatCards: React.FC<Props> = ({ overview, role }) => {
  const intl = useIntl();
  if (!overview) return null;

  // ✅ 统一标题样式：支持换行 + 对齐居中
  const titleStyle: React.CSSProperties = {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    lineHeight: 1.3,
    textAlign: 'center',
    fontSize: 14,
    minHeight: 36, // 保持标题高度一致
  };

  // ✅ 卡片内容样式：数字居中，字号更大
  const bodyStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 500,
    padding: '16px 8px',
  };

  return (
    <Row gutter={[16, 16]} justify="space-between" align="stretch">
      {/* 卡片 1️⃣：已审批工时 / 已批准条数 */}
      <Col flex="1">
        <Card
          title={
            <div style={titleStyle}>
              {role === 'LECTURER'
                ? intl.formatMessage({ id: 'statCards.approvedWorkEntries' })
                : intl.formatMessage({ id: 'statCards.approvedCount' })}
            </div>
          }
          bodyStyle={bodyStyle}
        >
          {overview.approvedCount ?? 0}
        </Card>
      </Col>

      {/* 卡片 2️⃣：根据角色展示不同内容 */}
      <Col flex="1">
        {role === 'LECTURER' ? (
          <Card
            title={<div style={titleStyle}>{intl.formatMessage({ id: 'statCards.remainingBudget' })}</div>}
            bodyStyle={bodyStyle}
          >
            {(overview as API.LecturerOverView).totalRemainingBudget ?? 0} hrs
          </Card>
        ) : (
          <Card
            title={<div style={titleStyle}>{intl.formatMessage({ id: 'statCards.unsubmittedWorkEntries' })}</div>}
            bodyStyle={bodyStyle}
          >
            {(overview as API.TutorOverView).unsubmittedWorkEntries ?? 0}
          </Card>
        )}
      </Col>

      {/* 卡片 3️⃣：审批率 */}
      <Col flex="1">
        <Card
          title={<div style={titleStyle}>{intl.formatMessage({ id: 'statCards.approvalRate' })}</div>}
          bodyStyle={bodyStyle}
        >
          {overview.approvalRate?.toFixed(2) ?? 0}%
        </Card>
      </Col>
    </Row>
  );
};

export default StatCards;
