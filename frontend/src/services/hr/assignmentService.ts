import {request} from "@umijs/max";

export async function getAssignments(params?: any) {
  return request('/api/assignment/list', { method: 'GET', params });
}

export async function createAssignment(data: any) {
  return request('/api/assignment/create', { method: 'POST', data });
}

export async function updateAssignment(id: number, data: any) {
  return request(`/api/assignment/update/${id}`, { method: 'PUT', data });
}

export async function deleteAssignment(id: number) {
  return request(`/api/assignment/delete/${id}`, { method: 'DELETE' });
}

export async function getAllCourses() {
  return request('/api/hr/course/list', { method: 'GET', params: { pageSize: 1000 } });
}

export async function getAllUsers() {
  return request('/api/user/list', { method: 'GET' });
}
