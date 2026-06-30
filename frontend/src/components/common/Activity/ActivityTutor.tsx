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
  Table, Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useModel, useIntl } from "@umijs/max";
import {
  getTutorAllocations,
} from "@/services/task";
import {
  getTutorsOfCourse,
} from "@/services/dashboard";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

type Props = {
  entries: API.WorkEntry[];
  tutorCourses: API.TutorCourse[];
  onCreate: (payload: API.WorkEntrySubmitRequest) => Promise<void> | void;
};

const ActivityTutor: React.FC<Props> = ({ entries, tutorCourses, onCreate }) => {

  const [form] = Form.useForm();
  const intl = useIntl();

  // === 全局用户信息 ===
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.currentUser as API.CurrentUser;
  const userId = currentUser?.id;

  // === 数据状态 ===
  const [allocations, setAllocations] = useState<API.AllocationResponse[]>([]);
  const [unitTutors, setUnitTutors] = useState<API.TutorOfCourseDTO[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  /**
   * 🔄 刷新课程相关数据
   */
  const refreshData = async (unitId: number, isSub: boolean) => {
    const res = await getTutorAllocations(unitId);

      if (!isSub) setAllocations(res || []);
      else setAllocations([]);

    const tutorsRes = await getTutorsOfCourse(unitId);
    if (tutorsRes) {
      let tutors = tutorsRes || [];
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
    const res = await getTutorAllocations(unitId, tutorId);

    setAllocations((res || []).filter((a) => a.tutorId === tutorId));

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
        substitute: values.isSubstitute,
      };

      setLoading(true);
      // message.success(intl.formatMessage({ id: "activity.tutor.submitSuccess" }));
      // ⭐ 通知父组件刷新 entries
      await onCreate(payload);
      setModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const columns: ColumnsType<API.WorkEntry> = [
    {
      title: intl.formatMessage({ id: "activity.tutor.course" }),
      dataIndex: "unitName",
    },
    {
      title: intl.formatMessage({ id: "activity.workType" }),
      dataIndex: "workType",
    },
    {
      title: intl.formatMessage({ id: "activity.tutor.weekStart" }),
      dataIndex: "weekStart",
    },
    {
      title: intl.formatMessage({ id: "activity.tutor.actualHours" }),
      dataIndex: "hours",
    },
    {
      title: intl.formatMessage({ id: "activity.tutor.status" }),
      dataIndex: "status",
      render: (status: 'DRAFT' | 'SUBMITTED' | 'APPROVED_BY_LECTURER' | 'FINAL_APPROVED' | 'REJECTED') => {
        const statusMap: Record<
          'DRAFT' | 'SUBMITTED' | 'APPROVED_BY_LECTURER' | 'FINAL_APPROVED' | 'REJECTED',
          { text: string; color: string }
        > = {
          DRAFT: {
            text: intl.formatMessage({ id: "status.draft" }),
            color: "default",
          },
          SUBMITTED: {
            text: intl.formatMessage({ id: "status.submitted" }),
            color: "blue",
          },
          APPROVED_BY_LECTURER: {
            text: intl.formatMessage({ id: "status.approvedByLecturer" }),
            color: "gold",
          },
          FINAL_APPROVED: {
            text: intl.formatMessage({ id: "status.finalApproved" }),
            color: "green",
          },
          REJECTED: {
            text: intl.formatMessage({ id: "status.rejected" }),
            color: "red",
          },
        };

        const item = statusMap[status] || { text: status, color: "default" };
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
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
      <Table
        columns={columns}
        dataSource={entries}      // ✅ 从 props 接收的 entries
        rowKey="id"
        pagination={false}
      />

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
              {(tutorCourses || []).map((c) => (
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
