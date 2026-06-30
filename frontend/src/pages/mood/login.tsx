import React, { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { request, history } from '@umijs/max';

const MoodLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await request<{
        token: string;
        user: { id: number; name: string; role: string };
      }>('/api/auth/login', {
        method: 'POST',
        data: { email, password },
        skipErrorHandler: false, // 默认false，可省略
      });

      // 如果执行到这里，说明登录成功（code === 'SYS-000'）
      localStorage.setItem('token', data.token);
      message.success('登录成功，欢迎回来 🌞');
      history.push('/mood');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #dfe9f3 0%, #ffffff 100%)',
      }}
    >
      <Card
        title="🌤 Mood Tracker 登录"
        style={{ width: 360, textAlign: 'center', borderRadius: 12 }}
      >
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleLogin}
        >
          登录
        </Button>
      </Card>
    </div>
  );
};

export default MoodLogin;
