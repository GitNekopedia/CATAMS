import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Select,
  Button,
  Table,
  Input,
  Space,
  Tabs,
  Popconfirm,
  Typography,
  message,
  Modal,
  Form,
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useIntl } from "@umijs/max";
import { getLecturerCourses, getTutorsOfCourse } from "@/services/dashboard";
import AllocationsTable from "@/components/common/AllocationsTable";
import {
  getTaskTypes,
  createTaskType,
  deleteTaskType,
  getTasks,
  createTask,
  deleteTask,
  saveTutorAllocations,
  getAllocations,
  deleteAllocationsByTask,
} from "@/services/task";

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const weeks = Array.from({ length: 12 }, (_, i) => `Week${i + 1}`);

const UnitAllocations: React.FC = () => {
  const intl = useIntl();

  const [allocations, setAllocations] = useState<Record<number, API.AllocationRow[]>>({});
  const [allocModalOpen, setAllocModalOpen] = useState(false);
  const [allocForm] = Form.useForm();
  const [currentTutor, setCurrentTutor] = useState<number | null>(null);

  const [units, setUnits] = useState<API.LecturerCourse[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [tutors, setTutors] = useState<API.TutorOfCourseDTO[]>([]);

  const [taskTypes, setTaskTypes] = useState<API.TaskTypeDTO[]>([]);
  const [tasks, setTasks] = useState<API.TaskDTO[]>([]);

  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [typeForm] = Form.useForm();
  const [taskForm] = Form.useForm();

  useEffect(() => {
    getLecturerCourses().then((res) => {
      if (res.success) {
        setUnits(res.data || []);
      } else {
        message.error(res.message || intl.formatMessage({ id: "unitAlloc.message.loadUnitFail" }));
      }
    });
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      getTutorsOfCourse(selectedUnit).then((res) => {
        if (res.success) setTutors(res.data || []);
        else message.error(res.message || intl.formatMessage({ id: "unitAlloc.message.loadTutorFail" }));
      });

      getTaskTypes(selectedUnit).then((res) => setTaskTypes(res.success ? res.data || [] : []));
      getTasks(selectedUnit).then((res) => setTasks(res.success ? res.data || [] : []));
      getAllocations(selectedUnit).then((res) => {
        if (res.success) {
          const grouped: Record<number, API.AllocationRow[]> = {};
          res.data.forEach((a) => {
            const weekKey = toWeekKey(a.weekStart, res.data);
            if (!grouped[a.tutorId]) grouped[a.tutorId] = [];

            let row = grouped[a.tutorId].find((r) => r.taskId === a.taskId);
            if (!row) {
              row = {
                key: `${a.tutorId}-${a.taskId}`,
                tutorId: a.tutorId,
                taskId: a.taskId,
                taskName: a.taskName,
                typeName: a.typeName,
                weekHours: Object.fromEntries(weeks.map((w) => [w, 0])),
              };
              grouped[a.tutorId].push(row);
            }
            row.weekHours[weekKey] = a.plannedHours;
          });
          setAllocations(grouped);
        }
      });
    }
  }, [selectedUnit]);

  function toWeekKey(weekStart: string, all: API.AllocationResponse[]): string {
    const allDates = all.map((a) => new Date(a.weekStart).getTime());
    const min = Math.min(...allDates);
    const diffWeeks = Math.floor((new Date(weekStart).getTime() - min) / (7 * 24 * 3600 * 1000));
    return `Week${diffWeeks + 1}`;
  }

  const onSaveTutorAllocations = async (tutorId: number) => {
    const rows = allocations[tutorId] || [];
    const payload: API.SaveTutorAllocationsRequest = {
      unitId: selectedUnit!,
      tutorId,
      allocations: rows.map((r) => ({
        taskId: r.taskId,
        weekHours: r.weekHours,
      })),
    };

    try {
      const res = await saveTutorAllocations(payload);
      if (res.success) {
        message.success(intl.formatMessage({ id: "unitAlloc.message.saveSuccess" }));
      } else {
        message.error(res.message || intl.formatMessage({ id: "unitAlloc.message.saveFail" }));
      }
    } catch (e) {
      message.error(intl.formatMessage({ id: "unitAlloc.message.requestFail" }));
    }
  };

  const onAddAllocation = async () => {
    const { taskId } = await allocForm.validateFields();
    const task = tasks.find((t) => t.id === taskId);
    if (!task || currentTutor === null) return;

    const newRow: API.AllocationRow = {
      key: `${currentTutor}-${task.id}-${Date.now()}`,
      tutorId: currentTutor,
      taskId: task.id,
      taskName: task.name,
      typeName: typeMap[task.typeId] || "Uncategorised",
      weekHours: Object.fromEntries(weeks.map((w) => [w, 0])),
    };

    setAllocations((prev) => ({
      ...prev,
      [currentTutor]: [...(prev[currentTutor] || []), newRow],
    }));

    setAllocModalOpen(false);
  };

  const handleWeekChange = (tutorId: number, taskId: number, week: string, value: number) => {
    setAllocations((prev) => ({
      ...prev,
      [tutorId]: (prev[tutorId] || []).map((r) =>
        r.taskId === taskId
          ? { ...r, weekHours: { ...r.weekHours, [week]: value } }
          : r
      ),
    }));
  };


  const typeMap = useMemo(
    () => taskTypes.reduce<Record<number, string>>((m, t) => ((m[t.id] = t.name), m), {}),
    [taskTypes]
  );

  const typeColumns = [
    { title: intl.formatMessage({ id: "unitAlloc.taskTypes" }), dataIndex: "name" },
    {
      title: intl.formatMessage({ id: "approvals.col.action" }),
      width: 100,
      render: (_: any, record: API.TaskTypeDTO) => (
        <Popconfirm
          title={intl.formatMessage({ id: "unitAlloc.message.taskTypeUsed" })}
          onConfirm={() => {
            const used = tasks.some((t) => t.typeId === record.id);
            if (used) {
              message.warning(intl.formatMessage({ id: "unitAlloc.message.taskTypeUsed" }));
              return;
            }
            deleteTaskType(record.id).then((res) => {
              if (res.success) {
                message.success(intl.formatMessage({ id: "unitAlloc.message.deleted" }));
                getTaskTypes(selectedUnit!).then((r) => setTaskTypes(r.data || []));
              } else {
                message.error(res.message || intl.formatMessage({ id: "unitAlloc.message.deleteFail" }));
              }
            });
          }}
        >
          <Button icon={<DeleteOutlined />} danger size="small" />
        </Popconfirm>
      ),
    },
  ];

  const typeTableTitle = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Text strong>{intl.formatMessage({ id: "unitAlloc.taskTypes" })}</Text>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          typeForm.resetFields();
          setTypeModalOpen(true);
        }}
      >
        {intl.formatMessage({ id: "unitAlloc.addType" })}
      </Button>
    </div>
  );

  const taskColumns = [
    { title: intl.formatMessage({ id: "unitAlloc.unitTasks" }), dataIndex: "name" },
    {
      title: intl.formatMessage({ id: "unitAlloc.taskTypes" }),
      dataIndex: "typeId",
      render: (id: number) => typeMap[id] || "-",
      width: 220,
    },
    {
      title: intl.formatMessage({ id: "approvals.col.action" }),
      width: 100,
      render: (_: any, record: API.TaskDTO) => (
        <Popconfirm
          title={intl.formatMessage({ id: "unitAlloc.message.deleteFail" })}
          onConfirm={() => {
            deleteTask(record.id).then((res) => {
              if (res.success) {
                message.success(intl.formatMessage({ id: "unitAlloc.message.deleted" }));
                getTasks(selectedUnit!).then((r) => setTasks(r.data || []));
              } else {
                message.error(res.message || intl.formatMessage({ id: "unitAlloc.message.deleteFail" }));
              }
            });
          }}
        >
          <Button icon={<DeleteOutlined />} danger size="small" />
        </Popconfirm>
      ),
    },
  ];

  const taskTableTitle = (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Text strong>{intl.formatMessage({ id: "unitAlloc.unitTasks" })}</Text>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          taskForm.resetFields();
          if (taskTypes.length === 0) {
            message.info(intl.formatMessage({ id: "unitAlloc.message.addSuccess" }));
            setTypeModalOpen(true);
            return;
          }
          setTaskModalOpen(true);
        }}
      >
        {intl.formatMessage({ id: "unitAlloc.addTask" })}
      </Button>
    </div>
  );


  const tutorTables = tutors.map((tutor) => (
    <Card
      key={tutor.id}
      title={tutor.name}
      style={{ marginBottom: 24 }}
      bordered
      extra={
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => {
              setCurrentTutor(tutor.id);
              allocForm.resetFields();
              setAllocModalOpen(true);
            }}
          >
            {intl.formatMessage({ id: "unitAlloc.addAllocation" })}
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<SaveOutlined />}
            onClick={() => onSaveTutorAllocations(tutor.id)}
          >
            {intl.formatMessage({ id: "unitAlloc.saveAllocations" })}
          </Button>
        </Space>
      }
    >
      <AllocationsTable
        editable
        data={(allocations[tutor.id] || []).map((row) => ({
          id: row.taskId, // 通用组件要求 key 是 id
          taskId: row.taskId,
          typeName: row.typeName,
          taskName: row.taskName,
          weekHours: row.weekHours,
        }))}
        onChange={(taskId, week, val) => handleWeekChange(tutor.id, taskId, week, val)}
        onDelete={async (record) => {
          const res = await deleteAllocationsByTask(tutor.id, record.taskId);
          if (res.success) {
            message.success(intl.formatMessage({ id: "unitAlloc.message.deleted" }));
            setAllocations((prev) => {
              const updated = { ...prev };
              updated[tutor.id] = updated[tutor.id].filter((r) => r.taskId !== record.taskId);
              return updated;
            });
          } else {
            message.error(res.message || intl.formatMessage({ id: "unitAlloc.message.deleteFail" }));
          }
        }}
      />
    </Card>
  ));

  const onCreateType = async () => {
    const { name } = await typeForm.validateFields();
    const res = await createTaskType({ unitId: selectedUnit!, name: name.trim() });
    if (res.success) {
      message.success(intl.formatMessage({ id: "unitAlloc.message.addSuccess" }));
      getTaskTypes(selectedUnit!).then((r) => setTaskTypes(r.data || []));
      setTypeModalOpen(false);
    } else {
      message.error(res.message || intl.formatMessage({ id: "unitAlloc.message.deleteFail" }));
    }
  };

  const onCreateTask = async () => {
    const { name, typeId } = await taskForm.validateFields();
    const res = await createTask({
      unitId: selectedUnit!,
      typeId: Number(typeId),
      name: name.trim(),
    });
    if (res.success) {
      message.success(intl.formatMessage({ id: "unitAlloc.message.taskCreated" }));
      getTasks(selectedUnit!).then((r) => setTasks(r.data || []));
      setTaskModalOpen(false);
    } else {
      message.error(res.message || intl.formatMessage({ id: "unitAlloc.message.deleteFail" }));
    }
  };

  return (
    <div>
      <Card title={intl.formatMessage({ id: "unitAlloc.selectUnit" })} style={{ marginBottom: 24 }}>
        <Select
          style={{ width: 400 }}
          placeholder={intl.formatMessage({ id: "unitAlloc.chooseUnit" })}
          onChange={(v) => setSelectedUnit(v)}
          value={selectedUnit ?? undefined}
        >
          {units.map((u) => (
            <Option key={u.unitId} value={u.unitId}>
              {u.code} - {u.name}
            </Option>
          ))}
        </Select>
      </Card>

      {selectedUnit && (
        <Tabs defaultActiveKey="1">
          <TabPane tab={intl.formatMessage({ id: "unitAlloc.editTasks" })} key="1">
            <Card
              title={
                <Text strong>
                  {units.find((u) => u.unitId === selectedUnit)?.code} -{" "}
                  {units.find((u) => u.unitId === selectedUnit)?.name}
                </Text>
              }
            >
              <Table
                columns={typeColumns}
                dataSource={taskTypes}
                rowKey="id"
                pagination={false}
                title={() => typeTableTitle}
                style={{ marginBottom: 24 }}
              />
              <Table
                columns={taskColumns}
                dataSource={tasks}
                rowKey="id"
                pagination={false}
                title={() => taskTableTitle}
              />
            </Card>
          </TabPane>

          <TabPane tab={intl.formatMessage({ id: "unitAlloc.allocations" })} key="2">
            <Card
              title={
                <Text strong>
                  {units.find((u) => u.unitId === selectedUnit)?.code} -{" "}
                  {units.find((u) => u.unitId === selectedUnit)?.name}
                </Text>
              }
            >
              {tutorTables}
            </Card>
          </TabPane>
        </Tabs>
      )}

      {/* 新增类型弹窗 */}
      <Modal
        title={intl.formatMessage({ id: "unitAlloc.addType" })}
        open={typeModalOpen}
        onOk={onCreateType}
        onCancel={() => setTypeModalOpen(false)}
        destroyOnClose
      >
        <Form form={typeForm} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: "unitAlloc.taskTypes" })}
            rules={[{ required: true, message: intl.formatMessage({ id: "unitAlloc.message.addSuccess" }) }]}
          >
            <Input placeholder="e.g. Tutorial / Lab / Marking" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增任务弹窗 */}
      <Modal
        title={intl.formatMessage({ id: "unitAlloc.addTask" })}
        open={taskModalOpen}
        onOk={onCreateTask}
        onCancel={() => setTaskModalOpen(false)}
        destroyOnClose
      >
        <Form form={taskForm} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: "unitAlloc.unitTasks" })}
            rules={[{ required: true, message: intl.formatMessage({ id: "unitAlloc.message.addSuccess" }) }]}
          >
            <Input placeholder="e.g. Tutorial 3 Fri 1-3" />
          </Form.Item>
          <Form.Item
            name="typeId"
            label={intl.formatMessage({ id: "unitAlloc.taskTypes" })}
            rules={[{ required: true, message: intl.formatMessage({ id: "unitAlloc.message.taskTypeUsed" }) }]}
          >
            <Select placeholder={intl.formatMessage({ id: "unitAlloc.taskTypes" })}>
              {taskTypes.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={intl.formatMessage({ id: "unitAlloc.addAllocation" })}
        open={allocModalOpen}
        onOk={onAddAllocation}
        onCancel={() => setAllocModalOpen(false)}
        destroyOnClose
      >
        <Form form={allocForm} layout="vertical">
          <Form.Item
            name="taskId"
            label={intl.formatMessage({ id: "unitAlloc.unitTasks" })}
            rules={[{ required: true, message: intl.formatMessage({ id: "unitAlloc.message.addSuccess" }) }]}
          >
            <Select placeholder={intl.formatMessage({ id: "unitAlloc.unitTasks" })}>
              {tasks.filter((t) => t.isActive).map((t) => (
                <Option key={t.id} value={t.id}>
                  [{typeMap[t.typeId] || "Uncategorised"}] {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UnitAllocations;
