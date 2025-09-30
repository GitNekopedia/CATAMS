import { useEffect, useState } from 'react';
import { Table, Tag, message, Collapse } from 'antd';
import { getAllTutorEntries } from '@/services/dashboard';

const { Panel } = Collapse;

const DetailedTutorWorkEntries: React.FC = () => {
  const [entries, setEntries] = useState<API.DetailedWorkEntry[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getAllTutorEntries();
    if (res.success) {
      setEntries(res.data || []);
    } else {
      message.error(res.message || '加载失败');
    }
  };

  const columns = [
    { title: '课程', dataIndex: 'unitName', key: 'unitName' },
    { title: '周起始', dataIndex: 'weekStart', key: 'weekStart' },
    { title: '类型', dataIndex: 'workType', key: 'workType' },
    { title: '工时', dataIndex: 'hours', key: 'hours' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '状态', dataIndex: 'status', key: 'status',
      render: (text: string) => {
        const color = text === 'SUBMITTED' ? 'blue' :
          text === 'REJECTED' ? 'red' :
            text.includes('APPROVED') ? 'green' : 'default';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { title: '提交时间', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>我的工时记录</h2>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={entries}
        expandable={{
          expandedRowRender: (record: API.DetailedWorkEntry) => (
            <Collapse ghost>
              <Panel header="审批流详情" key="1">
                {record.approvalTasks && record.approvalTasks.length > 0 ? (
                  record.approvalTasks.map((task, idx) => (
                    <div key={idx} style={{marginBottom: 8}}>
                      <span style={{marginRight: 8}}>
                        {task.processTime ? new Date(task.processTime).toLocaleString() : 'UnknownTime'}
                      </span>
                      <Tag color="purple">{task.step}</Tag>
                      <Tag color={task.action === 'APPROVE' ? 'green' : task.action === 'REJECT' ? 'red' : 'blue'}>
                        {task.action || 'PENDING'}
                      </Tag>
                      <span style={{marginLeft: 8}}>{task.actorName || '未处理'}</span>
                      {task.comment && <span style={{marginLeft: 8}}>备注: {task.comment}</span>}
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
    </div>
  );
};

export default DetailedTutorWorkEntries;
