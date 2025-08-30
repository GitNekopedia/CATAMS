// src/pages/tutor/dashboard/widgets/Welcome.tsx
import { Card } from 'antd';
import { useModel } from '@umijs/max';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.currentUser;

  return (
    <Card style={{ height: '100%' }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>早安，{user?.name}，祝你开心每一天！</div>
        <div style={{ color: '#666', marginTop: 8 }}>
          欢迎使用 CATAMS 系统。您当前身份是 <strong>{user?.role}</strong>
        </div>
      </div>
    </Card>
  );
};

export default Welcome;
