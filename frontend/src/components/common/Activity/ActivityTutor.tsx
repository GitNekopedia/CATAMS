import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useModel } from "@umijs/max";
import {
  getTutorCourses,
  getTutorAllocations,
} from "@/services/task"; // ⬅️ 你们自己定义的 service，路径要对
import {
  getTutorsOfCourse,
  submitWorkEntry,
} from "@/services/dashboard"; // ⬅️ 这里要包含接口实现
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

const ActivityTutor: React.FC = () => {
  const [form] = Form.useForm();

  // === 全局用户信息 ===
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.currentUser as API.CurrentUser;
  const userId = currentUser?.id;

  // === 数据状态 ===
  const [courses, setCourses] = useState<API.TutorCourse[]>([]); // tutor 拥有的课程
  const [allocations, setAllocations] = useState<API.AllocationResponse[]>([]); // 当前显示的任务分配
  const [unitTutors, setUnitTutors] = useState<API.TutorOfCourseDTO[]>([]); // 当前课程下的 tutor
  const [modalOpen, setModalOpen] = useState(false); // 提交工时弹窗
  const [loading, setLoading] = useState(false); // 提交按钮 loading

  // === 初始化：获取 tutor 的课程 ===
  useEffect(() => {
    getTutorCourses().then((res) => {
      if (res.success) {
        setCourses(res.data || []);
      } else {
        message.error(res.message || "加载课程失败");
      }
    });
  }, []);

  /**
   * 🔄 刷新课程相关数据（allocations + tutors）
   * @param unitId 课程 ID
   * @param isSub 是否为代课模式
   */
  const refreshData = async (unitId: number, isSub: boolean) => {
    // 获取工时分配（代课时先清空，等选择了 tutor 再加载）
    const res = await getTutorAllocations(unitId);
    if (res.success) {
      if (!isSub) setAllocations(res.data || []);
      else setAllocations([]);
    }

    // 获取课程下 tutor 列表
    const tutorsRes = await getTutorsOfCourse(unitId);
    if (tutorsRes.success) {
      let tutors = tutorsRes.data || [];
      if (isSub && userId) {
        tutors = tutors.filter((t) => t.id !== userId); // 代课时过滤掉自己
      }
      setUnitTutors(tutors);
    }
  };

  /**
   * 📌 课程切换
   */
  const handleUnitChange = async (unitId: number) => {
    const isSub = form.getFieldValue("isSubstitute") || false;
    await refreshData(unitId, isSub);
    form.setFieldsValue({ allocationId: undefined, substituteTutorId: undefined });
  };

  /**
   * 📌 代课对象切换
   */
  const handleSubstituteTutorChange = async (tutorId: number) => {
    const unitId = form.getFieldValue("unitId");
    if (!unitId) return;
    const res = await getTutorAllocations(unitId);
    if (res.success) {
      // 只展示该被代课 tutor 的分配
      setAllocations((res.data || []).filter((a) => a.tutorId === tutorId));
    }
  };

  /**
   * 📌 提交表单
   */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 找到选中的 allocation
      const allocation = allocations.find((a) => a.id === values.allocationId);
      if (!allocation) {
        message.error("未找到对应的任务分配");
        return;
      }

      // 构造提交 payload
      const payload: API.WorkEntrySubmitRequest = {
        originPlannedId: allocation.id, // planned_task_allocation.id
        taskId: allocation.taskId, // unit_task.id
        unitId: allocation.unitId, // course_unit.id
        weekStart: allocation.weekStart, // 周起始
        hours: values.actualHours, // 实际工时
        description: values.description,
        substituteTutorId: values.isSubstitute ? values.substituteTutorId : undefined,
      };

      setLoading(true);
      const res = await submitWorkEntry(payload);
      if (res.success) {
        message.success("提交成功");
        setModalOpen(false);
        form.resetFields();
      } else {
        message.error(res.message || "提交失败");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // === 表格：工时记录（这里你可以接后端接口展示 tutor 已提交工时） ===
  const columns: ColumnsType<any> = [
    { title: "课程", dataIndex: "unitName" },
    { title: "任务", dataIndex: "taskName" },
    { title: "类型", dataIndex: "typeName" },
    { title: "周起始", dataIndex: "weekStart" },
    { title: "计划工时", dataIndex: "plannedHours" },
    { title: "实际工时", dataIndex: "hours" }, // ⬅️ 从 work_entry 表里来的
  ];

  return (
    <Card
      title="Tutor 工时提交"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setModalOpen(true);
          }}
        >
          新增工时
        </Button>
      }
    >
      {/* 已提交工时表格（此处 dataSource 需要接接口，比如 getMyWorkEntries） */}
      <Table columns={columns} dataSource={[]} rowKey="id" />

      {/* 提交工时弹窗 */}
      <Modal
        title="提交工时"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {/* 选择课程 */}
          <Form.Item label="课程" name="unitId" rules={[{ required: true }]}>
            <Select placeholder="请选择课程" onChange={handleUnitChange}>
              {courses.map((c) => (
                <Option key={c.unitId} value={c.unitId}>
                  {c.code} - {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* 是否代课 */}
          <Form.Item label="是否代课" name="isSubstitute" valuePropName="checked">
            <Checkbox
              onChange={async (e) => {
                const isSub = e.target.checked;
                const unitId = form.getFieldValue("unitId");
                if (!unitId) {
                  message.warning("请先选择课程");
                  form.setFieldsValue({ isSubstitute: false });
                  return;
                }
                await refreshData(unitId, isSub);
                if (!isSub) {
                  form.setFieldsValue({ substituteTutorId: undefined });
                }
              }}
            >
              为其他 Tutor 代课
            </Checkbox>
          </Form.Item>

          {/* 代课对象（仅在勾选时显示） */}
          {form.getFieldValue("isSubstitute") && (
            <Form.Item
              label="代课对象"
              name="substituteTutorId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="请选择被代课的 Tutor"
                onChange={handleSubstituteTutorChange}
              >
                {unitTutors.map((t) => (
                  <Option key={t.id} value={t.id}>
                    {t.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* 任务分配选择 */}
          <Form.Item label="任务分配" name="allocationId" rules={[{ required: true }]}>
            <Select placeholder="请选择任务">
              {allocations.map((a) => (
                <Option key={a.id} value={a.id}>
                  [{a.typeName}] {a.taskName} - 周 {a.weekStart} (计划 {a.plannedHours}h)
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* 实际工时 */}
          <Form.Item
            label="实际工时"
            name="actualHours"
            rules={[{ required: true, type: "number", min: 0 }]}
          >
            <InputNumber step={0.5} style={{ width: "100%" }} />
          </Form.Item>

          {/* 描述 */}
          <Form.Item label="备注" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ActivityTutor;
