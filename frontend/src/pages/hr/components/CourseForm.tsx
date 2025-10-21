import { Form, Input, InputNumber, DatePicker, Button, Space, Select } from 'antd';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';

interface Props {
  initialValues?: API.CourseUnit | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }).map((_, i) => ({
  label: `${currentYear + i}`,
  value: `${currentYear + i}`,
}));

const semesterOptions = [
  { label: 'S1', value: 'S1' },
  { label: 'S2', value: 'S2' },
];

const CourseForm: React.FC<Props> = ({ initialValues, onSubmit, onCancel }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  // 拆解学期字符串（如2025S1）
  const initialYear = initialValues?.semester ? initialValues.semester.slice(0, 4) : undefined;
  const initialSem = initialValues?.semester ? initialValues.semester.slice(4) : undefined;

  const handleFinish = (values: any) => {
    const semester = values.year + values.semester;
    const formatted = {
      ...values,
      semester,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    };
    delete formatted.year;
    onSubmit(formatted);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        ...initialValues,
        year: initialYear,
        semester: initialSem,
        startDate: initialValues?.startDate ? dayjs(initialValues.startDate) : undefined,
        endDate: initialValues?.endDate ? dayjs(initialValues.endDate) : undefined,
      }}
    >
      {/* Course Code */}
      <Form.Item
        name="code"
        label={intl.formatMessage({ id: 'hr.courseForm.code.label' })}
        rules={[
          { required: true, message: intl.formatMessage({ id: 'hr.courseForm.code.required' }) },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: 'hr.courseForm.code.placeholder' })} />
      </Form.Item>

      {/* Course Name */}
      <Form.Item
        name="name"
        label={intl.formatMessage({ id: 'hr.courseForm.name.label' })}
        rules={[
          { required: true, message: intl.formatMessage({ id: 'hr.courseForm.name.required' }) },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Semester */}
      <Form.Item
        label={intl.formatMessage({ id: 'hr.courseForm.semester.label' })}
        required
      >
        <Space style={{ display: 'flex' }}>
          <Form.Item
            name="year"
            noStyle
            rules={[
              { required: true, message: intl.formatMessage({ id: 'hr.courseForm.year.required' }) },
            ]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'hr.courseForm.year.placeholder' })}
              style={{ width: 100 }}
              options={yearOptions}
            />
          </Form.Item>
          <Form.Item
            name="semester"
            noStyle
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'hr.courseForm.semester.required' }),
              },
            ]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'hr.courseForm.semester.placeholder' })}
              style={{ width: 80 }}
              options={semesterOptions}
            />
          </Form.Item>
        </Space>
      </Form.Item>

      {/* Start Date */}
      <Form.Item
        name="startDate"
        label={intl.formatMessage({ id: 'hr.courseForm.startDate.label' })}
        rules={[
          { required: true, message: intl.formatMessage({ id: 'hr.courseForm.startDate.required' }) },
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      {/* End Date */}
      <Form.Item
        name="endDate"
        label={intl.formatMessage({ id: 'hr.courseForm.endDate.label' })}
        rules={[
          { required: true, message: intl.formatMessage({ id: 'hr.courseForm.endDate.required' }) },
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      {/* Total Budget Hours */}
      <Form.Item
        name="totalBudgetHours"
        label={intl.formatMessage({ id: 'hr.courseForm.totalBudgetHours.label' })}
        rules={[
          { required: true, message: intl.formatMessage({ id: 'hr.courseForm.totalBudgetHours.required' }) },
        ]}
      >
        <InputNumber min={0} precision={2} style={{ width: '100%' }} />
      </Form.Item>

      {/* Remaining Budget Hours */}
      <Form.Item
        name="remainingBudget"
        label={intl.formatMessage({ id: 'hr.courseForm.remainingBudget.label' })}
        rules={[
          { required: true, message: intl.formatMessage({ id: 'hr.courseForm.remainingBudget.required' }) },
        ]}
      >
        <InputNumber min={0} precision={2} style={{ width: '100%' }} />
      </Form.Item>

      {/* Buttons */}
      <Form.Item>
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>
            {intl.formatMessage({ id: 'hr.courseForm.cancel' })}
          </Button>
          <Button type="primary" htmlType="submit">
            {intl.formatMessage({ id: 'hr.courseForm.save' })}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CourseForm;
