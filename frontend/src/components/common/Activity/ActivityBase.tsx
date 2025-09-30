import React from 'react';
import { List, Tag } from 'antd';

// 公共字段约束：保证传进来的类型至少有这些属性
type BaseWorkEntry = {
  id?: number;              // WorkEntry 用
  workEntryId?: number;     // LecturerPendingWorkEntry 用
  unitCode?: string;
  unitName?: string;
  weekStart: string;
  hours: number;
  workType?: string;
  status: string;
};

type Props<T extends BaseWorkEntry> = {
  entries: T[];
  header: React.ReactNode;
  renderActions?: (item: T) => React.ReactNode;
};

const statusColor = (status: string) => {
  switch (status) {
    case 'FINAL_APPROVED':
    case 'APPROVED':
    case 'APPROVED_BY_LECTURER':
      return 'green';
    case 'REJECTED':
      return 'red';
    case 'SUBMITTED':
    case 'APPROVED_BY_TUTOR':
      return 'blue';
    default:
      return 'orange'; // DRAFT 等
  }
};

const ActivityBase = <T extends BaseWorkEntry>({ entries, header, renderActions }: Props<T>) => {
  return (
    <List
      header={header}
      bordered
      dataSource={entries}
      renderItem={(item) => {
        // 统一 ID 获取逻辑
        const id = item.id ?? item.workEntryId;

        return (
          <List.Item key={id} extra={renderActions?.(item)}>
            <List.Item.Meta
              title={`${item.unitCode ?? '-'} ${item.unitName ?? '未知课程'} (${item.weekStart})`}
              description={`Hours: ${item.hours} • ${item.workType ?? '-'}`}
            />
            <Tag color={statusColor(item.status)}>{item.status}</Tag>
          </List.Item>
        );
      }}
    />
  );
};

export default ActivityBase;
