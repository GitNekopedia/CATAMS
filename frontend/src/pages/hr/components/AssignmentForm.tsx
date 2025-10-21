import { Form, Select, InputNumber } from 'antd';
import React from 'react';
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
          options={(courses || []).map(c => ({
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
          options={(users || []).map(u => ({
            label: `${u.name} (${u.email})`,
            value: u.id,
          }))}
        />
      </Form.Item>

      {/* Role */}
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
        <Select
          options={roleOptions}
          placeholder={intl.formatMessage({ id: 'hr.assignmentForm.role.placeholder' })}
        />
      </Form.Item>

      {/* Pay Rate */}
      <Form.Item
        name="payRate"
        label={intl.formatMessage({ id: 'hr.assignmentForm.payRate.label' })}
      >
        <InputNumber min={0} precision={2} style={{ width: '100%' }} />
      </Form.Item>

      {/* Quota Hours */}
      <Form.Item
        name="quotaHours"
        label={intl.formatMessage({ id: 'hr.assignmentForm.quotaHours.label' })}
      >
        <InputNumber min={0} precision={2} style={{ width: '100%' }} />
      </Form.Item>
    </Form>
  );
};

export default AssignmentForm;
