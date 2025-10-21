import { Form, Input, Select, Button, Space } from 'antd';
import { useIntl } from '@umijs/max';

interface Props {
  initialValues?: API.User | null;
  onSubmit: (values: API.UserForm) => void;
  onCancel: () => void;
}

const UserForm: React.FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  const roleOptions = [
    {
      label: intl.formatMessage({ id: 'hr.userForm.roles.Lecturer' }),
      value: 'Lecturer',
    },
    {
      label: intl.formatMessage({ id: 'hr.userForm.roles.Tutor' }),
      value: 'Tutor',
    },
    {
      label: intl.formatMessage({ id: 'hr.userForm.roles.HR' }),
      value: 'HR',
    },
    {
      label: intl.formatMessage({ id: 'hr.userForm.roles.Admin' }),
      value: 'Admin',
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialValues}
    >
      {/* Name */}
      <Form.Item
        name="name"
        label={intl.formatMessage({ id: 'hr.userForm.name.label' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'hr.userForm.name.required' }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Email */}
      <Form.Item
        name="email"
        label={intl.formatMessage({ id: 'hr.userForm.email.label' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'hr.userForm.email.required' }),
          },
        ]}
      >
        <Input type="email" />
      </Form.Item>

      {/* Role */}
      <Form.Item
        name="role"
        label={intl.formatMessage({ id: 'hr.userForm.role.label' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'hr.userForm.role.required' }),
          },
        ]}
      >
        <Select options={roleOptions} />
      </Form.Item>

      {/* Buttons */}
      <Form.Item>
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>
            {intl.formatMessage({ id: 'hr.userForm.cancel' })}
          </Button>
          <Button type="primary" htmlType="submit">
            {intl.formatMessage({ id: 'hr.userForm.save' })}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
