// @ts-ignore
import { request } from '@umijs/max';

// 获取某个 unit 下的 tutor
export async function getTutorsOfCourse(unitId: number) {
  return request<API.TutorOfCourseDTO[]>('/api/lecturer/units/tutors', {
    method: 'GET',
    params: { unitId },
  });
}

export async function submitWorkEntry(data: API.WorkEntrySubmitRequest) {
  return request<any>('/api/work-entry/submit', {
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
  return request<void>('/api/approvals/action', {
    method: 'POST',
    data: payload,
  });
}


export async function getAllLecturerEntries() {
  return request<API.DetailedLecturerPendingWorkEntry[]>('/api/lecturer/work-entries/all', {
    method: 'GET',
  });
}

export async function getAllTutorEntries() {
  return request<API.DetailedWorkEntry[]>('/api/tutor/work-entries/all', {
    method: 'GET',
  });
}


export async function getPendingApprovals() {
  return request<API.LecturerPendingWorkEntry[]>('/api/lecturer/entries');
}

export async function getLecturerCourses() {
  return request<API.LecturerCourse[]>('/api/lecturer/courses');
}

export async function getLecturerEntries() {
  return request<API.LecturerPendingWorkEntry[]>('/api/lecturer/recent-entries');
}

export async function getLecturerStats() {
  return request<API.StatData>('/api/lecturer/stats');
}

export async function getTutorCourses() {
  return request<API.TutorCourse[]>('/api/tutor/courses', {
    method: 'GET',
  });
}

export async function getRecentEntries() {
  return request<API.WorkEntry[]>('/api/tutor/entries', {
    method: 'GET',
  });
}

export async function getStats() {
  return request<API.StatData>('/api/tutor/overview', {
    method: 'GET',
  });
}

