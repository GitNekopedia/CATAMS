import { Form, Input, Select, Button, Space } from 'antd';

interface Props {
  initialValues?: API.User | null;
  onSubmit: (values: API.UserForm) => void;
  onCancel: () => void;
}

const UserForm: React.FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={initialValues}>
      <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}>
        <Input type="email" />
      </Form.Item>
      <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
        <Select
          options={[
            { label: 'Lecturer', value: 'Lecturer' },
            { label: 'Tutor', value: 'Tutor' },
            { label: 'HR', value: 'HR' },
            { label: 'Admin', value: 'Admin' },
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">保存</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
