import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
  ProFormDatePicker,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useState } from 'react';

type CourseUnit = {
  id: number;
  name: string;
};

type WorkEntryFormProps = {
  units: CourseUnit[];
  onSuccess?: () => void;
};

const WorkEntryForm: React.FC<WorkEntryFormProps> = ({ units, onSuccess }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async (values: any) => {
    console.log('提交内容:', values);
    // TODO: 替换为真实 API
    // await request('/api/tutor/work-entry', { method: 'POST', data: values });
    message.success('新增工时记录成功');
    setModalVisible(false);
    onSuccess?.();
  };

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        新增
      </Button>
      <ModalForm
        title="新增工时记录"
        open={modalVisible}
        onOpenChange={setModalVisible}
        onFinish={handleSubmit}
        modalProps={{
          destroyOnClose: true,
        }}
      >
        <ProFormSelect
          name="unitId"
          label="课程"
          placeholder="请选择课程"
          options={units.map((u) => ({ label: u.name, value: u.id }))}
          rules={[{ required: true, message: '请选择课程' }]}
        />
        <ProFormDatePicker
          name="weekStart"
          label="起始周（周一）"
          rules={[{ required: true, message: '请选择起始周' }]}
        />
        <ProFormSelect
          name="workType"
          label="工作类型"
          options={[
            { label: 'Tutorial', value: 'Tutorial' },
            { label: 'Consultation', value: 'Consultation' },
            { label: 'Marking', value: 'Marking' },
          ]}
          rules={[{ required: true, message: '请选择工作类型' }]}
        />
        <ProFormDigit
          name="hours"
          label="小时数"
          min={0.5}
          max={40}
          fieldProps={{ step: 0.5 }}
          rules={[{ required: true, message: '请输入小时数' }]}
        />
        <ProFormTextArea
          name="description"
          label="工作描述"
          placeholder="请输入工作内容（可选）"
        />
      </ModalForm>
    </>
  );
};

export default WorkEntryForm;
