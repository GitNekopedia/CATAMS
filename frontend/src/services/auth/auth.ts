import { request } from '@umijs/max';

// 获取当前用户
export async function currentUser() {
  return request<API.ApiResponse<API.CurrentUser>>('/api/auth/currentUser', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}
