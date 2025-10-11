import { useEffect } from 'react';
import { history, useModel } from '@umijs/max';

const RedirectToDashboard: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const role = initialState?.currentUser?.role;


  useEffect(() => {
    if (role === 'Tutor') {
      history.replace('/tutor/dashboard');
    } else if (role === 'Lecturer') {
      history.replace('/lecturer/dashboard');
    } else {
      history.replace('/user/login');
    }
  }, [role]);

  return null; // 这里不用渲染任何内容
};

export default RedirectToDashboard;
