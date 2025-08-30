import React from 'react';
import { List, Tag } from 'antd';
import WorkEntry = API.WorkEntry;


type Props = {
  entries: WorkEntry[];
};


const Activity: React.FC<Props> = ({ entries }) => {
  return (
    <List
      header={<div>Recent Work Entries</div>}
      bordered
      dataSource={entries}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={`${item.unitName} (${item.weekStart})`}
            description={`Hours: ${item.hours}`}
          />
          <Tag color={item.status === 'APPROVED' ? 'green' : 'orange'}>{item.status}</Tag>
        </List.Item>
      )}
    />
  );
};


export default Activity;
