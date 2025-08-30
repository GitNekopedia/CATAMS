import { request } from '@umijs/max';

export async function getPendingApprovals() {
  return request<API.ApiResponse<API.WorkEntry[]>>('/api/lecturer/pending-approvals');
}

export async function getLecturerCourses() {
  return request<API.ApiResponse<API.CourseUnit[]>>('/api/lecturer/courses');
}

export async function getLecturerEntries() {
  return request<API.ApiResponse<API.WorkEntry[]>>('/api/lecturer/recent-entries');
}

export async function getLecturerStats() {
  return request<API.ApiResponse<API.StatData>>('/api/lecturer/stats');
}

export async function getTutorCourses() {
  return request<API.ApiResponse<API.CourseUnit[]>>('/api/tutor/courses', {
    method: 'GET',
  });
}

export async function getRecentEntries() {
  return request<API.ApiResponse<API.WorkEntry[]>>('/api/tutor/entries', {
    method: 'GET',
  });
}

export async function getStats() {
  return request<API.ApiResponse<API.StatData>>('/api/tutor/stats', {
    method: 'GET',
  });
}

// 获取当前用户信息
export async function getCurrentUser() {
  return request<API.CurrentUser>('/api/auth/currentUser');
}

export async function getMyCourses() {
  return request('/api/tutor/my-courses');
}

export async function getTutorStats() {
  return request('/api/tutor/statistics');
}

export async function getRecentWorkEntries() {
  return request('/api/tutor/recent-entries');
}
