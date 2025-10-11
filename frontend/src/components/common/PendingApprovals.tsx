import React from 'react';
import { List, Tag } from 'antd';
import { useIntl } from '@umijs/max';
import WorkEntry = API.LecturerPendingWorkEntry;

type Props = {
  approvals: WorkEntry[];
};

const PendingApprovals: React.FC<Props> = ({ approvals }) => {
  const intl = useIntl();

  return (
    <List
      header={<div>{intl.formatMessage({ id: 'pendingApprovals.header' })}</div>}
      bordered
      dataSource={approvals}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a key="approve">{intl.formatMessage({ id: 'pendingApprovals.approve' })}</a>,
            <a key="reject" style={{ color: 'red' }}>
              {intl.formatMessage({ id: 'pendingApprovals.reject' })}
            </a>,
          ]}
        >
          <List.Item.Meta
            title={`${item.unitName} (${item.weekStart})`}
            description={intl.formatMessage(
              { id: 'pendingApprovals.duration' },
              { hours: item.hours }
            )}
          />
          <Tag color="orange">{item.status}</Tag>
        </List.Item>
      )}
    />
  );
};

export default PendingApprovals;
