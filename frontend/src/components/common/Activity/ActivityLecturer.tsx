import React from 'react';
import { Button, Space } from 'antd';
import ActivityBase from './ActivityBase';
import { useIntl } from '@umijs/max';
import WorkEntry = API.LecturerPendingWorkEntry;

type Props = {
  entries: WorkEntry[];
  onApprove?: (entryId: number) => Promise<void> | void;
  onReject?: (entryId: number) => Promise<void> | void;
};

const ActivityLecturer: React.FC<Props> = ({ entries, onApprove, onReject }) => {
  const intl = useIntl();

  return (
    <ActivityBase
      entries={entries}
      header={<div>{intl.formatMessage({ id: 'activity.lecturer.header' })}</div>}
      renderActions={(item) => {
        const pending = item.status === 'SUBMITTED' || item.status === 'APPROVED_BY_TUTOR';
        return (
          <>
            <div style={{ marginRight: 16 }}>
              {intl.formatMessage({ id: 'activity.lecturer.tutor' })}: {item.tutorName ?? intl.formatMessage({ id: 'activity.lecturer.unknownTutor' })}
            </div>
            {pending && (
              <Space>
                <Button size="small" type="primary" onClick={() => onApprove?.(item.workEntryId)}>
                  {intl.formatMessage({ id: 'activity.lecturer.approve' })}
                </Button>
                <Button size="small" danger onClick={() => onReject?.(item.workEntryId)}>
                  {intl.formatMessage({ id: 'activity.lecturer.reject' })}
                </Button>
              </Space>
            )}
          </>
        );
      }}
    />
  );
};

export default ActivityLecturer;
