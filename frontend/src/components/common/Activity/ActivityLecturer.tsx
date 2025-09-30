import React from 'react';
import { Button, Space } from 'antd';
import ActivityBase from './ActivityBase';
import WorkEntry = API.LecturerPendingWorkEntry;

type Props = {
  entries: WorkEntry[];
  onApprove?: (entryId: number) => Promise<void> | void;
  onReject?: (entryId: number) => Promise<void> | void;
};

const ActivityLecturer: React.FC<Props> = ({ entries, onApprove, onReject }) => {
  return (
    <ActivityBase
      entries={entries}
      header={<div>Recent Work Entries</div>}
      renderActions={(item) => {
        const pending = item.status === 'SUBMITTED' || item.status === 'APPROVED_BY_TUTOR';
        return (
          <>
            <div style={{ marginRight: 16 }}>
              Tutor: {item.tutorName ?? '未知'}
            </div>
            {pending && (
              <Space>
                <Button size="small" type="primary" onClick={() => onApprove?.(item.workEntryId)}>通过</Button>
                <Button size="small" danger onClick={() => onReject?.(item.workEntryId)}>驳回</Button>
              </Space>
            )}
          </>
        );
      }}
    />
  );
};

export default ActivityLecturer;
