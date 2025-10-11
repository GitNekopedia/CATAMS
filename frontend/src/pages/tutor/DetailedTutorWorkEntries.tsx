import { useEffect, useState } from 'react';
import { Table, Tag, message, Collapse } from 'antd';
import { useIntl } from '@umijs/max';
import { getAllTutorEntries } from '@/services/dashboard';

const { Panel } = Collapse;

const DetailedTutorWorkEntries: React.FC = () => {
  const intl = useIntl();
  const [entries, setEntries] = useState<API.DetailedWorkEntry[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getAllTutorEntries();
    if (res.success) {
      setEntries(res.data || []);
    } else {
      message.error(res.message || intl.formatMessage({ id: 'approvals.message.loadFail' }));
    }
  };

  const columns = [
    { title: intl.formatMessage({ id: 'approvals.col.unit' }), dataIndex: 'unitName', key: 'unitName' },
    { title: intl.formatMessage({ id: 'approvals.col.weekStart' }), dataIndex: 'weekStart', key: 'weekStart' },
    { title: intl.formatMessage({ id: 'approvals.col.type' }), dataIndex: 'workType', key: 'workType' },
    { title: intl.formatMessage({ id: 'approvals.col.hours' }), dataIndex: 'hours', key: 'hours' },
    { title: intl.formatMessage({ id: 'approvals.col.desc' }), dataIndex: 'description', key: 'description' },
    {
      title: intl.formatMessage({ id: 'approvals.col.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const color =
          text === 'SUBMITTED'
            ? 'blue'
            : text === 'REJECTED'
              ? 'red'
              : text.includes('APPROVED')
                ? 'green'
                : 'default';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { title: intl.formatMessage({ id: 'activity.tutor.submitTime' }, { defaultMessage: '提交时间' }), dataIndex: 'createdAt', key: 'createdAt' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>{intl.formatMessage({ id: 'activity.tutor.myEntries' }, { defaultMessage: '我的工时记录' })}</h2>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={entries}
        expandable={{
          expandedRowRender: (record: API.DetailedWorkEntry) => (
            <Collapse ghost>
              <Panel header={intl.formatMessage({ id: 'approvals.flow.detail' })} key="1">
                {record.approvalTasks && record.approvalTasks.length > 0 ? (
                  record.approvalTasks.map((task, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <span style={{ marginRight: 8 }}>
                        {task.processTime
                          ? new Date(task.processTime).toLocaleString()
                          : 'UnknownTime'}
                      </span>
                      <Tag color="purple">{task.step}</Tag>
                      <Tag
                        color={
                          task.action === 'APPROVE'
                            ? 'green'
                            : task.action === 'REJECT'
                              ? 'red'
                              : 'blue'
                        }
                      >
                        {task.action || 'PENDING'}
                      </Tag>
                      <span style={{ marginLeft: 8 }}>
                        {task.actorName || intl.formatMessage({ id: 'approvals.flow.none' })}
                      </span>
                      {task.comment && (
                        <span style={{ marginLeft: 8 }}>
                          {intl.formatMessage({ id: 'approvals.modal.comment.approve' })}: {task.comment}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <i>{intl.formatMessage({ id: 'approvals.flow.none' })}</i>
                )}
              </Panel>
            </Collapse>
          ),
        }}
      />
    </div>
  );
};

export default DetailedTutorWorkEntries;
