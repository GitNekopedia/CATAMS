// @ts-ignore
import { request } from '@umijs/max';

// 获取某个 unit 下的 tutor
export async function getTutorsOfCourse(unitId: number) {
  return request<API.ApiResponse<API.TutorOfCourseDTO[]>>('/api/lecturer/units/tutors', {
    method: 'GET',
    params: { unitId },
  });
}

export async function submitWorkEntry(data: API.WorkEntrySubmitRequest) {
  return request<API.ApiResponse<any>>('/api/work-entry/submit', {
    method: 'POST',
    data,
  });
}

// 统一审批接口
export async function submitApprovalAction(payload: {
  entryId: number;
  step: API.ApprovalStep; // LECTURER / HR
  action: API.ApprovalAction;
  comment?: string;
}) {
  return request<API.ApiResponse<void>>('/api/approvals/action', {
    method: 'POST',
    data: payload,
  });
}


export async function getAllLecturerEntries() {
  return request<API.ApiResponse<API.DetailedLecturerPendingWorkEntry[]>>('/api/lecturer/work-entries/all', {
    method: 'GET',
  });
}

export async function getAllTutorEntries() {
  return request<API.ApiResponse<API.DetailedWorkEntry[]>>('/api/tutor/work-entries/all', {
    method: 'GET',
  });
}


export async function getPendingApprovals() {
  return request<API.ApiResponse<API.LecturerPendingWorkEntry[]>>('/api/lecturer/entries');
}

export async function getLecturerCourses() {
  return request<API.ApiResponse<API.LecturerCourse[]>>('/api/lecturer/courses');
}

export async function getLecturerEntries() {
  return request<API.ApiResponse<API.LecturerPendingWorkEntry[]>>('/api/lecturer/entries');
}

export async function getLecturerStats() {
  return request<API.ApiResponse<API.StatData>>('/api/lecturer/stats');
}

export async function getTutorCourses() {
  return request<API.ApiResponse<API.TutorCourse[]>>('/api/tutor/courses', {
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

