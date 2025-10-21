import { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Select, Input, Modal } from 'antd';
import { useIntl } from '@umijs/max';
import { getUserList, createUser, updateUser, deleteUser } from '@/services/hr/userService';
import UserForm from './components/UserForm';

const UserManagement: React.FC = () => {
  const intl = useIntl();

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
    } catch {
      message.error(intl.formatMessage({ id: 'hr.userManagement.message.loadFail' }));
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
      message.success(intl.formatMessage({ id: 'hr.userManagement.message.deleteSuccess' }));
      fetchData();
    } else message.error(res.message);
  };

  const handleSave = async (values: API.UserForm) => {
    const res = editingUser
      ? await updateUser(editingUser.id, values)
      : await createUser(values);

    if (res.success) {
      message.success(
        intl.formatMessage({
          id: editingUser
            ? 'hr.userManagement.message.updateSuccess'
            : 'hr.userManagement.message.createSuccess',
        }),
      );
      setFormVisible(false);
      setEditingUser(null);
      fetchData();
    } else {
      message.error(res.message || intl.formatMessage({ id: 'hr.userManagement.message.actionFail' }));
    }
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'hr.userManagement.table.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'hr.userManagement.table.email' }),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: intl.formatMessage({ id: 'hr.userManagement.table.role' }),
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: intl.formatMessage({ id: 'hr.userManagement.table.createdAt' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: intl.formatMessage({ id: 'hr.userManagement.table.actions' }),
      key: 'action',
      render: (_: any, record: API.User) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingUser(record);
              setFormVisible(true);
            }}
          >
            {intl.formatMessage({ id: 'hr.userManagement.table.edit' })}
          </Button>
          <Popconfirm
            title={intl.formatMessage({ id: 'hr.userManagement.table.confirmDelete' })}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              {intl.formatMessage({ id: 'hr.userManagement.table.delete' })}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>
        {intl.formatMessage({ id: 'hr.userManagement.title' })}
      </h2>

      {/* Filters */}
      <Space style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder={intl.formatMessage({ id: 'hr.userManagement.filter.role' })}
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
          placeholder={intl.formatMessage({ id: 'hr.userManagement.filter.keyword' })}
          onSearch={setSearchKeyword}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          onClick={() => {
            setEditingUser(null);
            setFormVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'hr.userManagement.filter.add' })}
        </Button>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal */}
      <Modal
        title={
          editingUser
            ? intl.formatMessage({ id: 'hr.userManagement.table.edit' })
            : intl.formatMessage({ id: 'hr.userManagement.filter.add' })
        }
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
