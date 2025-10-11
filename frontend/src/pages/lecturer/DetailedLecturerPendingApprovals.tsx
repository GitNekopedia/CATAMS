import { useEffect, useState } from 'react';
import { Table, Tag, message, Input, Space, Collapse, Button, Modal, Form } from 'antd';
import { useIntl } from '@umijs/max';
import { getAllLecturerEntries, submitApprovalAction } from '@/services/dashboard';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Panel } = Collapse;

const DetailedLecturerPendingApprovals: React.FC = () => {
  const intl = useIntl();
  const [currentAction, setCurrentAction] = useState<API.ApprovalAction | null>(null);
  const [entries, setEntries] = useState<API.DetailedLecturerPendingWorkEntry[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<API.DetailedLecturerPendingWorkEntry | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await getAllLecturerEntries();
    if (res.success) {
      setEntries(res.data || []);
    } else {
      message.error(res.message || intl.formatMessage({ id: 'approvals.message.loadFail' }));
    }
    setLoading(false);
  };

  const openApprovalModal = (
    record: API.DetailedLecturerPendingWorkEntry,
    action: 'APPROVE' | 'REJECT'
  ) => {
    setCurrentRecord(record);
    setCurrentAction(action);
    setModalVisible(true);
    form.resetFields();
  };

  const handleSubmitApproval = async () => {
    try {
      const values = await form.validateFields();
      if (!currentRecord || !currentAction) return;

      const res = await submitApprovalAction({
        entryId: currentRecord.workEntryId,
        step: 'LECTURER',
        action: currentAction!,
        comment: values.comment,
      });

      if (res.success) {
        if (currentAction === 'APPROVE') {
          message.success(
            values.comment
              ? intl.formatMessage({ id: 'approvals.message.success.approve' }, { comment: values.comment })
              : intl.formatMessage({ id: 'approvals.message.success.approve.noComment' })
          );
        } else {
          message.success(
            intl.formatMessage({ id: 'approvals.message.success.reject' }, { comment: values.comment })
          );
        }
        setModalVisible(false);
        fetchData();
      } else {
        message.error(res.message || intl.formatMessage({ id: 'approvals.message.error' }));
      }
    } catch {
      // 表单校验失败
    }
  };

  const filteredEntries = entries.filter(
    (e) =>
      e.tutorName?.toLowerCase().includes(searchText.toLowerCase()) ||
      e.unitName?.toLowerCase().includes(searchText.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<API.DetailedLecturerPendingWorkEntry> = [
    { title: intl.formatMessage({ id: 'approvals.col.tutor' }), dataIndex: 'tutorName', key: 'tutorName' },
    { title: intl.formatMessage({ id: 'approvals.col.unit' }), dataIndex: 'unitName', key: 'unitName' },
    { title: intl.formatMessage({ id: 'approvals.col.code' }), dataIndex: 'unitCode', key: 'unitCode' },
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
    {
      title: intl.formatMessage({ id: 'approvals.col.action' }),
      key: 'actions',
      render: (_, record) => {
        if (record.status === 'SUBMITTED') {
          return (
            <Space>
              <Button type="primary" size="small" onClick={() => openApprovalModal(record, 'APPROVE')}>
                {intl.formatMessage({ id: 'approvals.action.approve' })}
              </Button>
              <Button danger size="small" onClick={() => openApprovalModal(record, 'REJECT')}>
                {intl.formatMessage({ id: 'approvals.action.reject' })}
              </Button>
            </Space>
          );
        }
        return <i>{intl.formatMessage({ id: 'approvals.action.processed' })}</i>;
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>{intl.formatMessage({ id: 'approvals.header' })}</h2>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder={intl.formatMessage({ id: 'approvals.searchPlaceholder' })}
          onSearch={(val) => setSearchText(val)}
          allowClear
          enterButton
        />
      </Space>
      <Table
        rowKey="approvalTaskId"
        columns={columns}
        dataSource={filteredEntries}
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record: API.DetailedLecturerPendingWorkEntry) => (
            <Collapse ghost>
              <Panel header={intl.formatMessage({ id: 'approvals.flow.detail' })} key="1">
                {record.approvalTasks && record.approvalTasks.length > 0 ? (
                  record.approvalTasks.map((task, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <span style={{ marginRight: 8 }}>
                        {task.processTime
                          ? new Date(task.processTime).toLocaleString()
                          : intl.formatMessage({ id: 'approvals.flow.none' })}
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

      <Modal
        title={
          currentAction === 'APPROVE'
            ? intl.formatMessage({ id: 'approvals.modal.approve' })
            : intl.formatMessage({ id: 'approvals.modal.reject' })
        }
        open={modalVisible}
        onOk={handleSubmitApproval}
        onCancel={() => setModalVisible(false)}
        okText={intl.formatMessage({ id: 'approvals.modal.ok' })}
        cancelText={intl.formatMessage({ id: 'approvals.modal.cancel' })}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="comment"
            label={
              currentAction === 'APPROVE'
                ? intl.formatMessage({ id: 'approvals.modal.comment.approve' })
                : intl.formatMessage({ id: 'approvals.modal.comment.reject' })
            }
            rules={
              currentAction === 'REJECT'
                ? [{ required: true, message: intl.formatMessage({ id: 'approvals.modal.comment.placeholder.reject' }) }]
                : []
            }
          >
            <Input.TextArea
              rows={4}
              placeholder={
                currentAction === 'APPROVE'
                  ? intl.formatMessage({ id: 'approvals.modal.comment.placeholder.approve' })
                  : intl.formatMessage({ id: 'approvals.modal.comment.placeholder.reject' })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DetailedLecturerPendingApprovals;
