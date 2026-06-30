import React, { useLayoutEffect } from 'react';
import {history, Outlet, useLocation} from '@umijs/max';
import {LogoutOutlined} from "@ant-design/icons";
import {Button, Space} from "antd";

const MoodLayout: React.FC = () => {
  const location = useLocation(); // ✅ 获取当前路径
  const currentPath = location.pathname;

  useLayoutEffect(() => {
    const token = localStorage.getItem('token');
    const currentPath = history.location.pathname;

    // ✅ 未登录时跳转到 mood 登录页
    if (!token && currentPath !== '/mood/login') {
      history.replace('/mood/login');
    }

    // ✅ 已登录但在登录页时跳转到首页
    if (token && currentPath === '/mood/login') {
      history.replace('/mood');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // 退出时跳转到 mood 登录页
    history.replace('/mood/login');
  };

  console.log('✅ MoodLayout rendered', history.location.pathname);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dfe9f3 0%, #ffffff 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ✅ 自定义顶部栏 */}
      {currentPath !== '/mood/login' && (
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '12px 24px',
      }}>
        <Space>
          <Button
            size="small"
            type="link"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            退出
          </Button>
        </Space>
      </div>
      )}

      {/* 子页面 */}
      <Outlet />
    </div>
  );
};

export default MoodLayout;
