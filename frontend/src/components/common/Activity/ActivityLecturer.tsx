import React from 'react';
import { Button, Space } from 'antd';
import { useIntl, history } from '@umijs/max';
import ActivityBase from './ActivityBase';
import WorkEntry = API.LecturerPendingWorkEntry;

type Props = {
  entries: WorkEntry[];
};

const ActivityLecturer: React.FC<Props> = ({ entries }) => {
  const intl = useIntl();

  const handleView = (entryId: number) => {
    // ✅ 跳转到 Work Entries 页面，可带上参数（例如某条 entryId）
    history.push(`/lecturer/work-entries?highlight=${entryId}`);
  };

  return (
    <ActivityBase
      entries={entries}
      header={<div>{intl.formatMessage({ id: 'activity.lecturer.header' })}</div>}
      renderActions={(item) => (
        <Space>
          <Button
            size="small"
            type="link"
            onClick={() => handleView(item.workEntryId)}
          >
            {intl.formatMessage({ id: 'activity.lecturer.view' })}
          </Button>
        </Space>
      )}
    />
  );
};

export default ActivityLecturer;
