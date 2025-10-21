import { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Popconfirm,
} from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';
import {
  getCourseList,
  createCourse,
  updateCourse,
  deleteCourse,
} from '@/services/hr/courseService';
import CourseForm from './components/CourseForm';
import { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

const CourseManagement: React.FC = () => {
  const intl = useIntl();
  const [courses, setCourses] = useState<API.CourseUnit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    code: '',
    name: '',
    minBudget: undefined as number | undefined,
    maxBudget: undefined as number | undefined,
    dateRange: [] as any[],
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<API.CourseUnit | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        pageSize,
        code: filters.code || undefined,
        name: filters.name || undefined,
        minBudget: filters.minBudget,
        maxBudget: filters.maxBudget,
      };
      if (filters.dateRange?.length === 2) {
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const res = await getCourseList(params);
      if (res.success) {
        setCourses(res.data.list);
        setTotal(res.data.total);
      } else {
        message.error(res.message);
      }
    } catch {
      message.error(intl.formatMessage({ id: 'hr.courseManagement.message.loadFail' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const handleSave = async (values: any) => {
    let res;
    if (editingCourse) {
      res = await updateCourse(editingCourse.id, values);
    } else {
      res = await createCourse(values);
    }

    if (res.success) {
      message.success(
        intl.formatMessage({
          id: editingCourse
            ? 'hr.courseManagement.message.updateSuccess'
            : 'hr.courseManagement.message.createSuccess',
        }),
      );
      setModalVisible(false);
      setEditingCourse(null);
      fetchData();
    } else {
      message.error(res.message || intl.formatMessage({ id: 'hr.courseManagement.message.actionFail' }));
    }
  };

  const handleDelete = async (record: API.CourseUnit) => {
    const res = await deleteCourse(record.id);
    if (res.success) {
      message.success(intl.formatMessage({ id: 'hr.courseManagement.message.deleteSuccess' }));
      fetchData();
    } else {
      message.error(res.message);
    }
  };

  const columns: ColumnsType<API.CourseUnit> = [
    {
      title: intl.formatMessage({ id: 'hr.courseManagement.table.code' }),
      dataIndex: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: intl.formatMessage({ id: 'hr.courseManagement.table.name' }),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: intl.formatMessage({ id: 'hr.courseManagement.table.semester' }),
      dataIndex: 'semester',
      sorter: (a, b) => a.semester.localeCompare(b.semester),
    },
    {
      title: intl.formatMessage({ id: 'hr.courseManagement.table.startDate' }),
      dataIndex: 'startDate',
      sorter: (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix(),
    },
    {
      title: intl.formatMessage({ id: 'hr.courseManagement.table.endDate' }),
      dataIndex: 'endDate',
      sorter: (a, b) => dayjs(a.endDate).unix() - dayjs(b.endDate).unix(),
    },
    {
      title: intl.formatMessage({ id: 'hr.courseManagement.table.totalBudgetHours' }),
      dataIndex: 'totalBudgetHours',
      sorter: (a, b) => a.totalBudgetHours - b.totalBudgetHours,
    },
    {
      title: intl.formatMessage({ id: 'hr.courseManagement.table.remainingBudget' }),
      dataIndex: 'remainingBudget',
      sorter: (a, b) => a.remainingBudget - b.remainingBudget,
    },
    {
      title: intl.formatMessage({ id: 'hr.courseManagement.table.actions' }),
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingCourse(record);
              setModalVisible(true);
            }}
          >
            {intl.formatMessage({ id: 'hr.courseManagement.table.edit' })}
          </Button>
          <Popconfirm
            title={intl.formatMessage({ id: 'hr.courseManagement.table.confirmDelete' })}
            onConfirm={() => handleDelete(record)}
          >
            <Button type="link" danger>
              {intl.formatMessage({ id: 'hr.courseManagement.table.delete' })}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleReset = () => {
    setFilters({
      code: '',
      name: '',
      minBudget: undefined,
      maxBudget: undefined,
      dateRange: [],
    });
    setPage(1);
    fetchData();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>
        {intl.formatMessage({ id: 'hr.courseManagement.title' })}
      </h2>

      {/* Filters */}
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          placeholder={intl.formatMessage({ id: 'hr.courseManagement.filter.code' })}
          value={filters.code}
          onChange={(e) => setFilters({ ...filters, code: e.target.value })}
          style={{ width: 150 }}
        />
        <Input
          placeholder={intl.formatMessage({ id: 'hr.courseManagement.filter.name' })}
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          style={{ width: 180 }}
        />
        <InputNumber
          placeholder={intl.formatMessage({ id: 'hr.courseManagement.filter.minBudget' })}
          value={filters.minBudget}
          onChange={(val) => setFilters({ ...filters, minBudget: val ?? undefined })}
          style={{ width: 120 }}
        />
        <InputNumber
          placeholder={intl.formatMessage({ id: 'hr.courseManagement.filter.maxBudget' })}
          value={filters.maxBudget}
          onChange={(val) => setFilters({ ...filters, maxBudget: val ?? undefined })}
          style={{ width: 120 }}
        />
        <RangePicker
          value={filters.dateRange}
          onChange={(val) => setFilters({ ...filters, dateRange: val || [] })}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => {
            setPage(1);
            fetchData();
          }}
        >
          {intl.formatMessage({ id: 'hr.courseManagement.filter.search' })}
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          {intl.formatMessage({ id: 'hr.courseManagement.filter.reset' })}
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCourse(null);
            setModalVisible(true);
          }}
        >
          {intl.formatMessage({ id: 'hr.courseManagement.filter.add' })}
        </Button>
      </Space>

      {/* Table */}
      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={courses}
        rowKey="id"
        pagination={{
          total,
          current: page,
          pageSize,
          showSizeChanger: true,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />

      {/* Modal */}
      <Modal
        title={
          editingCourse
            ? intl.formatMessage({ id: 'hr.courseManagement.table.edit' })
            : intl.formatMessage({ id: 'hr.courseManagement.filter.add' })
        }
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <CourseForm
          initialValues={editingCourse}
          onSubmit={handleSave}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default CourseManagement;
