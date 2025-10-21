import { request } from '@umijs/max';

export async function getCourseList(params: any) {
  return request('/api/hr/course/list', {
    method: 'GET',
    params,
  });
}

export async function createCourse(data: any) {
  return request('/api/hr/course/create', { method: 'POST', data });
}

export async function updateCourse(id: number, data: any) {
  return request(`/api/hr/course/update/${id}`, { method: 'PUT', data });
}

export async function deleteCourse(id: number) {
  return request(`/api/hr/course/delete/${id}`, { method: 'DELETE' });
}
