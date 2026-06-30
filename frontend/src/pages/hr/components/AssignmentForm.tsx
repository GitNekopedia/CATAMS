import { Form, Select, InputNumber, Input } from 'antd';
import React, { useMemo } from 'react';
import { useIntl } from '@umijs/max';

interface AssignmentFormProps {
  form: any;
  courses: any[];
  users: any[];
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ form, courses, users }) => {
  const intl = useIntl();

  const roleOptions = [
    { label: 'Lecturer', value: 'LECTURER' },
    { label: 'Tutor', value: 'TUTOR' },
  ];

  // ⭐ 只保留 Lecturer / Tutor 的用户
  const assignableUsers = useMemo(
    () => (users || []).filter(
      (u) => u.role === 'Lecturer' || u.role === 'Tutor',
    ),
    [users],
  );

  // ⭐ 选中用户时，自动把该用户的 role 写入表单
  const handleUserChange = (userId: number) => {
    const selected = assignableUsers.find((u) => u.id === userId);
    if (selected) {
      form.setFieldsValue({
        role: selected.role,
      });
    } else {
      form.setFieldsValue({ role: undefined });
    }
  };

  return (
    <Form form={form} layout="vertical">
      {/* Course */}
      <Form.Item
        name="unitId"
        label={intl.formatMessage({ id: 'hr.assignmentForm.course.label' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'hr.assignmentForm.course.required' }),
          },
        ]}
      >
        <Select
          showSearch
          placeholder={intl.formatMessage({ id: 'hr.assignmentForm.course.placeholder' })}
          optionFilterProp="label"
          options={(courses || []).map((c) => ({
            label: `${c.code} - ${c.name}`,
            value: c.id,
          }))}
        />
      </Form.Item>

      {/* User */}
      <Form.Item
        name="userId"
        label={intl.formatMessage({ id: 'hr.assignmentForm.user.label' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'hr.assignmentForm.user.required' }),
          },
        ]}
      >
        <Select
          showSearch
          placeholder={intl.formatMessage({ id: 'hr.assignmentForm.user.placeholder' })}
          optionFilterProp="label"
          options={assignableUsers.map((u) => ({
            label: `${u.name} (${u.email}) [${u.role}]`,
            value: u.id,
          }))}
          onChange={handleUserChange}  // ⭐ 关键：自动带出 role
        />
      </Form.Item>

      {/* Role：由 user.role 决定，不允许手动选择 */}
      <Form.Item
        name="role"
        label={intl.formatMessage({ id: 'hr.assignmentForm.role.label' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'hr.assignmentForm.role.required' }),
          },
        ]}
      >
        {/* 你可以用 disabled Select，看起来还是下拉框样式 */}
        <Select
          disabled
          options={roleOptions}
          placeholder={intl.formatMessage({ id: 'hr.assignmentForm.role.placeholder' })}
        />
        {/* 或者用 Input 展示纯文本，也可以：
        <Input disabled />
        */}
      </Form.Item>


    </Form>
  );
};

export default AssignmentForm;
