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
import { useModel, useIntl } from "@umijs/max";
import {
  getTutorCourses,
  getTutorAllocations,
} from "@/services/task";
import {
  getTutorsOfCourse,
  submitWorkEntry,
} from "@/services/dashboard";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

const ActivityTutor: React.FC = () => {
  const [form] = Form.useForm();
  const intl = useIntl();

  // === 全局用户信息 ===
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.currentUser as API.CurrentUser;
  const userId = currentUser?.id;

  // === 数据状态 ===
  const [courses, setCourses] = useState<API.TutorCourse[]>([]);
  const [allocations, setAllocations] = useState<API.AllocationResponse[]>([]);
  const [unitTutors, setUnitTutors] = useState<API.TutorOfCourseDTO[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // === 初始化：获取 tutor 的课程 ===
  useEffect(() => {
    getTutorCourses().then((res) => {
      if (res.success) {
        setCourses(res.data || []);
      } else {
        message.error(intl.formatMessage({ id: "activity.tutor.loadCourseFail" }));
      }
    });
  }, []);

  /**
   * 🔄 刷新课程相关数据
   */
  const refreshData = async (unitId: number, isSub: boolean) => {
    const res = await getTutorAllocations(unitId);
    if (res.success) {
      if (!isSub) setAllocations(res.data || []);
      else setAllocations([]);
    }

    const tutorsRes = await getTutorsOfCourse(unitId);
    if (tutorsRes.success) {
      let tutors = tutorsRes.data || [];
      if (isSub && userId) {
        tutors = tutors.filter((t) => t.id !== userId);
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
      setAllocations((res.data || []).filter((a) => a.tutorId === tutorId));
    }
  };

  /**
   * 📌 提交表单
   */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const allocation = allocations.find((a) => a.id === values.allocationId);
      if (!allocation) {
        message.error(intl.formatMessage({ id: "activity.tutor.error.noAllocation" }));
        return;
      }

      const payload: API.WorkEntrySubmitRequest = {
        originPlannedId: allocation.id,
        taskId: allocation.taskId,
        unitId: allocation.unitId,
        weekStart: allocation.weekStart,
        hours: values.actualHours,
        description: values.description,
        substituteTutorId: values.isSubstitute ? values.substituteTutorId : undefined,
      };

      setLoading(true);
      const res = await submitWorkEntry(payload);
      if (res.success) {
        message.success(intl.formatMessage({ id: "activity.tutor.submitSuccess" }));
        setModalOpen(false);
        form.resetFields();
      } else {
        message.error(res.message || intl.formatMessage({ id: "activity.tutor.submitFail" }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // === 表格：工时记录 ===
  const columns: ColumnsType<any> = [
    { title: intl.formatMessage({ id: "activity.tutor.course" }), dataIndex: "unitName" },
    { title: intl.formatMessage({ id: "activity.tutor.allocation" }), dataIndex: "taskName" },
    { title: intl.formatMessage({ id: "activity.workType" }), dataIndex: "typeName" },
    { title: intl.formatMessage({ id: "activity.tutor.weekStart" }, { defaultMessage: "周起始" }), dataIndex: "weekStart" },
    { title: intl.formatMessage({ id: "activity.tutor.plannedHours" }, { defaultMessage: "计划工时" }), dataIndex: "plannedHours" },
    { title: intl.formatMessage({ id: "activity.tutor.actualHours" }), dataIndex: "hours" },
  ];

  return (
    <Card
      title={intl.formatMessage({ id: "activity.tutor.title" })}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setModalOpen(true);
          }}
        >
          {intl.formatMessage({ id: "activity.tutor.add" })}
        </Button>
      }
    >
      <Table columns={columns} dataSource={[]} rowKey="id" />

      <Modal
        title={intl.formatMessage({ id: "activity.tutor.modalTitle" })}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {/* 选择课程 */}
          <Form.Item
            label={intl.formatMessage({ id: "activity.tutor.course" })}
            name="unitId"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={intl.formatMessage({ id: "activity.tutor.selectCourse" })}
              onChange={handleUnitChange}
            >
              {courses.map((c) => (
                <Option key={c.unitId} value={c.unitId}>
                  {c.code} - {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* 是否代课 */}
          <Form.Item
            label={intl.formatMessage({ id: "activity.tutor.substitute" })}
            name="isSubstitute"
            valuePropName="checked"
          >
            <Checkbox
              onChange={async (e) => {
                const isSub = e.target.checked;
                const unitId = form.getFieldValue("unitId");
                if (!unitId) {
                  message.warning(intl.formatMessage({ id: "activity.tutor.warning.noCourse" }));
                  form.setFieldsValue({ isSubstitute: false });
                  return;
                }
                await refreshData(unitId, isSub);
                if (!isSub) {
                  form.setFieldsValue({ substituteTutorId: undefined });
                }
              }}
            >
              {intl.formatMessage({ id: "activity.tutor.substituteLabel" })}
            </Checkbox>
          </Form.Item>

          {/* 代课对象 */}
          {form.getFieldValue("isSubstitute") && (
            <Form.Item
              label={intl.formatMessage({ id: "activity.tutor.substituteTutor" })}
              name="substituteTutorId"
              rules={[{ required: true }]}
            >
              <Select
                placeholder={intl.formatMessage({ id: "activity.tutor.selectSubstitute" })}
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

          {/* 任务分配 */}
          <Form.Item
            label={intl.formatMessage({ id: "activity.tutor.allocation" })}
            name="allocationId"
            rules={[{ required: true }]}
          >
            <Select placeholder={intl.formatMessage({ id: "activity.tutor.selectAllocation" })}>
              {allocations.map((a) => (
                <Option key={a.id} value={a.id}>
                  [{a.typeName}] {a.taskName} - {a.weekStart} ({intl.formatMessage({ id: "activity.tutor.plannedHours" }, { defaultMessage: "计划" })} {a.plannedHours}h)
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* 实际工时 */}
          <Form.Item
            label={intl.formatMessage({ id: "activity.tutor.actualHours" })}
            name="actualHours"
            rules={[{ required: true, type: "number", min: 0 }]}
          >
            <InputNumber step={0.5} style={{ width: "100%" }} />
          </Form.Item>

          {/* 描述 */}
          <Form.Item
            label={intl.formatMessage({ id: "activity.tutor.description" })}
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ActivityTutor;
