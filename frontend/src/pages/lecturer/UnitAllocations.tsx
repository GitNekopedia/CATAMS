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
import {PlusOutlined, DeleteOutlined, SaveOutlined} from "@ant-design/icons";
import { getLecturerCourses, getTutorsOfCourse } from "@/services/dashboard";
import {
  getTaskTypes,
  createTaskType,
  deleteTaskType,
  getTasks,
  createTask,
  deleteTask, saveTutorAllocations, getAllocations, deleteAllocationsByTask,
} from "@/services/task";


const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const weeks = Array.from({ length: 12 }, (_, i) => `Week${i + 1}`);

const UnitAllocations: React.FC = () => {

  // 新增状态
  const [allocations, setAllocations] = useState<Record<number, API.AllocationRow[]>>({});
  // key: tutorId, value: 该 tutor 的分配行数组

  const [allocModalOpen, setAllocModalOpen] = useState(false);
  const [allocForm] = Form.useForm();
  const [currentTutor, setCurrentTutor] = useState<number | null>(null);


  const [units, setUnits] = useState<API.LecturerCourse[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [tutors, setTutors] = useState<API.TutorOfCourseDTO[]>([]);

  // 后端 TaskType / Task
  const [taskTypes, setTaskTypes] = useState<API.TaskTypeDTO[]>([]);
  const [tasks, setTasks] = useState<API.TaskDTO[]>([]);

  // 弹窗表单
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [typeForm] = Form.useForm();
  const [taskForm] = Form.useForm();

  // 获取 lecturer 的课程
  useEffect(() => {
    getLecturerCourses().then((res) => {
      if (res.success) {
        setUnits(res.data || []);
      } else {
        message.error(res.message || "加载课程失败");
      }
    });
  }, []);

  // 当选择课程时，获取 tutor / taskTypes / tasks
  useEffect(() => {
    if (selectedUnit) {
      getTutorsOfCourse(selectedUnit).then((res) => {
        if (res.success) setTutors(res.data || []);
        else message.error(res.message || "加载导师失败");
      });

      getTaskTypes(selectedUnit).then((res) =>
        setTaskTypes(res.success ? res.data || [] : [])
      );
      getTasks(selectedUnit).then((res) =>
        setTasks(res.success ? res.data || [] : [])
      );
      // 新增：加载 allocations
      getAllocations(selectedUnit).then((res) => {
        if (res.success) {
          const grouped: Record<number, API.AllocationRow[]> = {};
          res.data.forEach((a) => {
            const weekKey = toWeekKey(a.weekStart, res.data);
            // 写个小函数把 weekStart 映射成 Week1/Week2/...
            if (!grouped[a.tutorId]) grouped[a.tutorId] = [];

            let row = grouped[a.tutorId].find(r => r.taskId === a.taskId);
            if (!row) {
              row = {
                key: `${a.tutorId}-${a.taskId}`,
                tutorId: a.tutorId,
                taskId: a.taskId,
                taskName: a.taskName,
                typeName: a.typeName,
                weekHours: Object.fromEntries(weeks.map(w => [w, 0])),
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
    // 找到最早的 weekStart 当 Week1
    const allDates = all.map(a => new Date(a.weekStart).getTime());
    const min = Math.min(...allDates);
    const diffWeeks = Math.floor((new Date(weekStart).getTime() - min) / (7 * 24 * 3600 * 1000));
    return `Week${diffWeeks + 1}`;
  }

  // 保存函数
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
        message.success("保存成功");
      } else {
        message.error(res.message || "保存失败");
      }
    } catch (e) {
      message.error("请求失败，请检查后端接口");
    }
  };

  // 新增分配
  const onAddAllocation = async () => {
    const { taskId } = await allocForm.validateFields();
    const task = tasks.find(t => t.id === taskId);
    if (!task || currentTutor === null) return;

    const newRow: API.AllocationRow = {
      key: `${currentTutor}-${task.id}-${Date.now()}`,
      tutorId: currentTutor,
      taskId: task.id,
      taskName: task.name,
      typeName: typeMap[task.typeId] || "Uncategorised",
      weekHours: Object.fromEntries(weeks.map(w => [w, 0])),
    };

    setAllocations(prev => ({
      ...prev,
      [currentTutor]: [...(prev[currentTutor] || []), newRow],
    }));

    setAllocModalOpen(false);
  };

  const typeMap = useMemo(
    () =>
      taskTypes.reduce<Record<number, string>>(
        (m, t) => ((m[t.id] = t.name), m),
        {}
      ),
    [taskTypes]
  );

  // ========== TaskTypes 表格 ==========
  const typeColumns = [
    { title: "Type Name", dataIndex: "name" },
    {
      title: "Action",
      width: 100,
      render: (_: any, record: API.TaskTypeDTO) => (
        <Popconfirm
          title="Delete this type?"
          onConfirm={() => {
            const used = tasks.some((t) => t.typeId === record.id);
            if (used) {
              message.warning("该类型已被任务使用，无法删除");
              return;
            }
            deleteTaskType(record.id).then((res) => {
              if (res.success) {
                message.success("已删除");
                getTaskTypes(selectedUnit!).then((r) =>
                  setTaskTypes(r.data || [])
                );
              } else {
                message.error(res.message);
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
      <Text strong>Task Types</Text>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          typeForm.resetFields();
          setTypeModalOpen(true);
        }}
      >
        Add Type
      </Button>
    </div>
  );

  // ========== Tasks 表格 ==========
  const taskColumns = [
    { title: "Task Name", dataIndex: "name" },
    {
      title: "Type",
      dataIndex: "typeId",
      render: (id: number) => typeMap[id] || "-",
      width: 220,
    },
    {
      title: "Action",
      width: 100,
      render: (_: any, record: API.TaskDTO) => (
        <Popconfirm
          title="Delete this task?"
          onConfirm={() => {
            deleteTask(record.id).then((res) => {
              if (res.success) {
                message.success("已删除");
                getTasks(selectedUnit!).then((r) => setTasks(r.data || []));
              } else {
                message.error(res.message);
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
      <Text strong>Unit Tasks</Text>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          taskForm.resetFields();
          if (taskTypes.length === 0) {
            message.info("请先添加一个 Task Type");
            setTypeModalOpen(true);
            return;
          }
          setTaskModalOpen(true);
        }}
      >
        Add Task
      </Button>
    </div>
  );

  // ========== Tutor Allocation 表格 ==========
  const allocationColumns = [
    {
      title: "Task",
      dataIndex: "taskName",
      fixed: "left",
      width: 260,
      render: (_: any, row: API.AllocationRow) =>
        `[${row.typeName}] ${row.taskName}`,
    },
    ...weeks.map((week) => ({
      title: week,
      dataIndex: ["weekHours", week],
      render: (_: any, row: API.AllocationRow) => (
        <Input
          type="number"
          min={0}
          style={{ width: 60 }}
          value={row.weekHours[week]}
          onChange={(e) => {
            const val = Number(e.target.value);
            setAllocations((prev) => ({
              ...prev,
              [row.key.split("-")[0]]: (prev[Number(row.key.split("-")[0])] || []).map(
                (r) =>
                  r.key === row.key
                    ? { ...r, weekHours: { ...r.weekHours, [week]: val } }
                    : r
              ),
            }));
          }}
        />
      ),
    })),
    {
      title: "Action",
      width: 100,
      fixed: "right",
      render: (_: any, record: API.AllocationRow) => (
        <Popconfirm
          title="Delete this allocation?"
          onConfirm={async () => {
            const res = await deleteAllocationsByTask(
              Number(record.key.split("-")[0]), // tutorId
              record.taskId
            );
            if (res.success) {
              message.success("Deleted");
              setAllocations((prev) => {
                const updated = { ...prev };
                updated[record.tutorId] = updated[record.tutorId].filter((r) => r.taskId !== record.taskId);
                return updated;
              });
            } else {
              message.error(res.message || "删除失败");
            }
          }}
        >
          <Button icon={<DeleteOutlined />} danger size="small" />
        </Popconfirm>
      ),
    }
  ];

  const tutorTables = tutors.map((tutor) => {

    return (
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
              Add Allocation
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<SaveOutlined />}
              onClick={() => onSaveTutorAllocations(tutor.id)}
            >
              Save Allocations
            </Button>
          </Space>
        }
      >
        <Table
          columns={allocationColumns}
          dataSource={allocations[tutor.id] || []}
          pagination={false}
          rowKey="key"
          scroll={{ x: 1500 }}
        />
      </Card>
    );
  });

  // ========== 新增 TaskType/Task ==========
  const onCreateType = async () => {
    const { name } = await typeForm.validateFields();
    const res = await createTaskType({ unitId: selectedUnit!, name: name.trim() });
    if (res.success) {
      message.success("添加成功");
      getTaskTypes(selectedUnit!).then((r) => setTaskTypes(r.data || []));
      setTypeModalOpen(false);
    } else {
      message.error(res.message);
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
      message.success("任务已创建");
      getTasks(selectedUnit!).then((r) => setTasks(r.data || []));
      setTaskModalOpen(false);
    } else {
      message.error(res.message);
    }
  };

  return (
    <div>
      {/* 选择课程 */}
      <Card title="Select Unit" style={{ marginBottom: 24 }}>
        <Select
          style={{ width: 400 }}
          placeholder="Choose a Unit"
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
          {/* Tab1：任务与类型管理 */}
          <TabPane tab="Edit Unit Tasks" key="1">
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

          {/* Tab2：分配 */}
          <TabPane tab="Tutor Allocations" key="2">
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
        title="Add Task Type"
        open={typeModalOpen}
        onOk={onCreateType}
        onCancel={() => setTypeModalOpen(false)}
        destroyOnClose
      >
        <Form form={typeForm} layout="vertical">
          <Form.Item
            name="name"
            label="Type Name"
            rules={[{ required: true, message: "Please input type name" }]}
          >
            <Input placeholder="e.g. Tutorial / Lab / Marking" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增任务弹窗 */}
      <Modal
        title="Add Task"
        open={taskModalOpen}
        onOk={onCreateTask}
        onCancel={() => setTaskModalOpen(false)}
        destroyOnClose
      >
        <Form form={taskForm} layout="vertical">
          <Form.Item
            name="name"
            label="Task Name"
            rules={[{ required: true, message: "Please input task name" }]}
          >
            <Input placeholder="e.g. Tutorial 3 Fri 1-3" />
          </Form.Item>
          <Form.Item
            name="typeId"
            label="Type"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select placeholder="Select a type">
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
        title="Add Allocation"
        open={allocModalOpen}
        onOk={onAddAllocation}
        onCancel={() => setAllocModalOpen(false)}
        destroyOnClose
      >
        <Form form={allocForm} layout="vertical">
          <Form.Item
            name="taskId"
            label="Select Task"
            rules={[{ required: true, message: "Please select a task" }]}
          >
            <Select placeholder="Choose a task">
              {tasks.filter(t => t.isActive).map((t) => (
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
