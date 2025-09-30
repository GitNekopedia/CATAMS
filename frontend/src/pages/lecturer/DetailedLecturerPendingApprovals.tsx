import { useEffect, useState } from 'react';
import { Table, Tag, message, Input, Space, Collapse, Button, Modal, Form } from 'antd';
import { getAllLecturerEntries, submitApprovalAction } from '@/services/dashboard';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Panel } = Collapse;

const DetailedLecturerPendingApprovals: React.FC = () => {
  const [currentAction, setCurrentAction] = useState<API.ApprovalAction | null>(null);
  const [entries, setEntries] = useState<API.DetailedLecturerPendingWorkEntry[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // 弹窗状态
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
      message.error(res.message || '加载失败');
    }
    setLoading(false);
  };

  // 打开审批弹窗
  const openApprovalModal = (
    record: API.DetailedLecturerPendingWorkEntry,
    action: 'APPROVE' | 'REJECT'
  ) => {
    setCurrentRecord(record);
    setCurrentAction(action);
    setModalVisible(true);
    form.resetFields();
  };

  // 提交审批
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
          message.success(values.comment ? `已通过，批注：${values.comment}` : '已通过');
        } else {
          message.success(`已驳回，原因：${values.comment}`);
        }
        setModalVisible(false);
        fetchData();
      } else {
        message.error(res.message || '操作失败');
      }
    } catch {
      // 表单校验失败，不处理
    }
  };

  // 全局搜索
  const filteredEntries = entries.filter(
    (e) =>
      e.tutorName?.toLowerCase().includes(searchText.toLowerCase()) ||
      e.unitName?.toLowerCase().includes(searchText.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<API.DetailedLecturerPendingWorkEntry> = [
    { title: '助教', dataIndex: 'tutorName', key: 'tutorName' },
    { title: '课程', dataIndex: 'unitName', key: 'unitName' },
    { title: '课程代码', dataIndex: 'unitCode', key: 'unitCode' },
    { title: '周起始', dataIndex: 'weekStart', key: 'weekStart' },
    { title: '类型', dataIndex: 'workType', key: 'workType' },
    { title: '工时', dataIndex: 'hours', key: 'hours' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态',
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
      title: '操作',
      key: 'actions',
      render: (_, record) => {
        // ✅ 只有 SUBMITTED 的才显示操作
        if (record.status === 'SUBMITTED') {
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                onClick={() => openApprovalModal(record, 'APPROVE')}
              >
                通过
              </Button>
              <Button
                danger
                size="small"
                onClick={() => openApprovalModal(record, 'REJECT')}
              >
                驳回
              </Button>
            </Space>
          );
        }
        return <i>已处理</i>;
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>待审批工时记录</h2>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索助教/课程/描述"
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
              <Panel header="审批流详情" key="1">
                {record.approvalTasks && record.approvalTasks.length > 0 ? (
                  record.approvalTasks.map((task, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <span style={{ marginRight: 8 }}>
                        {task.processTime
                          ? new Date(task.processTime).toLocaleString()
                          : '未处理'}
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
                        {task.actorName || '未处理人'}
                      </span>
                      {task.comment && (
                        <span style={{ marginLeft: 8 }}>备注: {task.comment}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <i>暂无审批记录</i>
                )}
              </Panel>
            </Collapse>
          ),
        }}
      />

      {/* 审批弹窗 */}
      <Modal
        title={currentAction === 'APPROVE' ? '通过工时记录' : '驳回工时记录'}
        open={modalVisible}
        onOk={handleSubmitApproval}
        onCancel={() => setModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="comment"
            label={currentAction === 'APPROVE' ? '通过批注' : '驳回原因'}
            rules={
              currentAction === 'REJECT'
                ? [{ required: true, message: '请输入驳回原因' }]
                : []
            }
          >
            <Input.TextArea
              rows={4}
              placeholder={
                currentAction === 'APPROVE'
                  ? '可填写通过批注（选填）'
                  : '请输入驳回原因（必填）'
              }
            />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
};

export default DetailedLecturerPendingApprovals;
