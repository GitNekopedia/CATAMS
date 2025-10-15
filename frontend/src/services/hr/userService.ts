import { request } from '@umijs/max';

export async function getUserList(params?: { role?: string; keyword?: string }) {
  return request('/api/user/list', { params });
}

export async function createUser(data: API.UserForm) {
  return request('/api/user/create', { method: 'POST', data });
}

export async function updateUser(id: number, data: API.UserForm) {
  return request(`/api/user/update/${id}`, { method: 'PUT', data });
}

export async function deleteUser(id: number) {
  return request(`/api/user/delete/${id}`, { method: 'DELETE' });
}
