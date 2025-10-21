import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Select, Input, Modal, message, Popconfirm, Form,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
} from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAllCourses,
  getAllUsers,
} from '@/services/hr/assignmentService';
import AssignmentForm from './components/AssignmentForm';

interface Assignment {
  id: number;
  courseCode: string;
  courseName: string;
  userName: string;
  userEmail: string;
  role: string;
  payRate: number;
  quotaHours: number;
  semester: string;
}

const UnitAssignment: React.FC = () => {
  const intl = useIntl();

  /** ==== State ==== */
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    unitId: undefined as number | undefined,
    role: undefined as string | undefined,
    keyword: '',
  });
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);

  /** ==== Fetch Data ==== */
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await getAssignments(filters);
      if (res.success) {
        setAssignments(Array.isArray(res.data) ? res.data : []);
      } else {
        message.error(res.message);
      }
    } catch {
      message.error(intl.formatMessage({ id: 'hr.unitAssignment.message.loadFail' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    getAllCourses().then(res => setCourses(res?.data?.list || []));
    getAllUsers().then(res => setUsers(res?.data || []));
  }, []);

  /** ==== CRUD ==== */
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const res = editing
        ? await updateAssignment(editing.id, values)
        : await createAssignment(values);

      if (res.success) {
        message.success(
          intl.formatMessage({
            id: editing
              ? 'hr.unitAssignment.message.updateSuccess'
              : 'hr.unitAssignment.message.createSuccess',
          }),
        );
        setModalVisible(false);
        setEditing(null);
        fetchAssignments();
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await deleteAssignment(id);
    if (res.success) {
      message.success(intl.formatMessage({ id: 'hr.unitAssignment.message.deleteSuccess' }));
      fetchAssignments();
    } else {
      message.error(res.message);
    }
  };

  /** ==== Columns ==== */
  const columns = [
    {
      title: intl.formatMessage({ id: 'hr.unitAssignment.table.course' }),
      dataIndex: 'courseName',
      sorter: (a: Assignment, b: Assignment) => a.courseName.localeCompare(b.courseName),
    },
    {
      title: intl.formatMessage({ id: 'hr.unitAssignment.table.semester' }),
      dataIndex: 'semester',
      sorter: (a: Assignment, b: Assignment) => a.semester.localeCompare(b.semester),
    },
    {
      title: intl.formatMessage({ id: 'hr.unitAssignment.table.user' }),
      render: (_: any, record: Assignment) =>
        `${record.userName} (${record.userEmail})`,
    },
    {
      title: intl.formatMessage({ id: 'hr.unitAssignment.table.role' }),
      dataIndex: 'role',
      filters: [
        { text: 'Lecturer', value: 'LECTURER' },
        { text: 'Tutor', value: 'TUTOR' },
        { text: 'Marker', value: 'MARKER' },
      ],
      onFilter: (value: string, record: Assignment) => record.role === value,
    },
    {
      title: intl.formatMessage({ id: 'hr.unitAssignment.table.payRate' }),
      dataIndex: 'payRate',
    },
    {
      title: intl.formatMessage({ id: 'hr.unitAssignment.table.quotaHours' }),
      dataIndex: 'quotaHours',
    },
    {
      title: intl.formatMessage({ id: 'hr.unitAssignment.table.actions' }),
      render: (_: any, record: Assignment) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => {
              setEditing(record);
              setModalVisible(true);
              form.setFieldsValue(record);
            }}
          >
            {intl.formatMessage({ id: 'hr.unitAssignment.table.edit' })}
          </Button>
          <Popconfirm
            title={intl.formatMessage({ id: 'hr.unitAssignment.table.confirmDelete' })}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} type="link" danger>
              {intl.formatMessage({ id: 'hr.unitAssignment.table.delete' })}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /** ==== Render ==== */
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>
        {intl.formatMessage({ id: 'hr.unitAssignment.title' })}
      </h2>

      {/* Filters */}
      <Space wrap style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder={intl.formatMessage({ id: 'hr.unitAssignment.filter.course' })}
          style={{ width: 200 }}
          options={(courses || []).map(c => ({
            label: `${c.code} - ${c.name}`,
            value: c.id,
          }))}
          onChange={val => setFilters({ ...filters, unitId: val })}
        />
        <Select
          allowClear
          placeholder={intl.formatMessage({ id: 'hr.unitAssignment.filter.role' })}
          style={{ width: 150 }}
          options={[
            { label: 'Lecturer', value: 'LECTURER' },
            { label: 'Tutor', value: 'TUTOR' },
          ]}
          onChange={val => setFilters({ ...filters, role: val })}
        />
        <Input
          placeholder={intl.formatMessage({ id: 'hr.unitAssignment.filter.keyword' })}
          style={{ width: 200 }}
          value={filters.keyword}
          onChange={e => setFilters({ ...filters, keyword: e.target.value })}
        />
        <Button
          icon={<SearchOutlined />}
          type="primary"
          onClick={fetchAssignments}
        >
          {intl.formatMessage({ id: 'hr.unitAssignment.filter.search' })}
        </Button>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'hr.unitAssignment.filter.add' })}
        </Button>
      </Space>

      {/* Table */}
      <Table bordered loading={loading} columns={columns} dataSource={assignments} rowKey="id" />

      {/* Modal */}
      <Modal
        title={
          editing
            ? intl.formatMessage({ id: 'hr.unitAssignment.modal.editTitle' })
            : intl.formatMessage({ id: 'hr.unitAssignment.modal.createTitle' })
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText={intl.formatMessage({ id: 'hr.unitAssignment.modal.save' })}
        destroyOnClose
      >
        <AssignmentForm form={form} courses={courses} users={users} />
      </Modal>
    </div>
  );
};

export default UnitAssignment;
