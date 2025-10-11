import React from 'react';
import { List, Tag } from 'antd';
import { useIntl } from '@umijs/max';

type BaseWorkEntry = {
  id?: number;
  workEntryId?: number;
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
      return 'orange';
  }
};

const ActivityBase = <T extends BaseWorkEntry>({ entries, header, renderActions }: Props<T>) => {
  const intl = useIntl();

  return (
    <List
      header={header}
      bordered
      dataSource={entries}
      renderItem={(item) => {
        const id = item.id ?? item.workEntryId;
        return (
          <List.Item key={id} extra={renderActions?.(item)}>
            <List.Item.Meta
              title={`${item.unitCode ?? '-'} ${item.unitName ?? intl.formatMessage({ id: 'activity.unit.unknown' })} (${item.weekStart})`}
              description={`${intl.formatMessage({ id: 'activity.hours' })}: ${item.hours} • ${intl.formatMessage({ id: 'activity.workType' })}: ${item.workType ?? '-'}`}
            />
            <Tag color={statusColor(item.status)}>{item.status}</Tag>
          </List.Item>
        );
      }}
    />
  );
};

export default ActivityBase;
