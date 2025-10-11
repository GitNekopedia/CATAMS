// src/pages/tutor/dashboard/widgets/Welcome.tsx
import { Card } from 'antd';
import {useIntl, useModel} from '@umijs/max';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.currentUser;
  const intl = useIntl();

  return (
    <Card style={{ height: '100%' }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          {intl.formatMessage(
            { id: 'tutor.dashboard.welcome.greeting' },
            { name: user?.name || '' }
          )}
        </div>
        <div style={{ color: '#666', marginTop: 8 }}>
          {intl.formatMessage(
            { id: 'tutor.dashboard.welcome.identity' },
            { role: user?.role || '' }
          )}
        </div>
      </div>
    </Card>
  );
};

export default Welcome;
