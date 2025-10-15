import { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Select, Input, Modal } from 'antd';
import { getUserList, createUser, updateUser, deleteUser } from '@/services/hr/userService';
import UserForm from './components/UserForm';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<API.User[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string | undefined>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editingUser, setEditingUser] = useState<API.User | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getUserList({ role: roleFilter, keyword: searchKeyword });
      if (res.success) setUsers(res.data);
      else message.error(res.message);
    } catch (err) {
      console.error(err);
      message.error('加载用户失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleFilter, searchKeyword]);

  const handleDelete = async (id: number) => {
    const res = await deleteUser(id);
    if (res.success) {
      message.success('删除成功');
      fetchData();
    } else message.error(res.message);
  };

  const handleSave = async (values: API.UserForm) => {
    const res = editingUser ? await updateUser(editingUser.id, values) : await createUser(values);
    if (res.success) {
      message.success(editingUser ? '更新成功' : '创建成功');
      setFormVisible(false);
      setEditingUser(null);
      fetchData();
    } else message.error(res.message);
  };

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: API.User) => (
        <Space>
          <Button type="link" onClick={() => { setEditingUser(record); setFormVisible(true); }}>编辑</Button>
          <Popconfirm title="确定删除该用户？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>用户管理</h2>
      <Space style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="按角色筛选"
          style={{ width: 160 }}
          onChange={setRoleFilter}
          options={[
            { label: 'Lecturer', value: 'Lecturer' },
            { label: 'Tutor', value: 'Tutor' },
            { label: 'HR', value: 'HR' },
            { label: 'Admin', value: 'Admin' },
          ]}
        />
        <Input.Search
          placeholder="搜索姓名或邮箱"
          onSearch={setSearchKeyword}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={() => { setEditingUser(null); setFormVisible(true); }}>
          新增用户
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
        destroyOnClose
      >
        <UserForm
          initialValues={editingUser}
          onSubmit={handleSave}
          onCancel={() => setFormVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;
