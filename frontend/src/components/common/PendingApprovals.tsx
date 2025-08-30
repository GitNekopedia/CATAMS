import React from 'react';
import { List, Tag } from 'antd';
import WorkEntry = API.WorkEntry;

type Props = {
  approvals: WorkEntry[];
};

const PendingApprovals: React.FC<Props> = ({ approvals }) => {
  return (
    <List
      header={<div>待审批工时</div>}
      bordered
      dataSource={approvals}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a key="approve">批准</a>,
            <a key="reject" style={{ color: 'red' }}>拒绝</a>,
          ]}
        >
          <List.Item.Meta
            title={`${item.unitName} (${item.weekStart})`}
            description={`申请时长: ${item.hours} 小时`}
          />
          <Tag color="orange">{item.status}</Tag>
        </List.Item>
      )}
    />
  );
};

export default PendingApprovals;
