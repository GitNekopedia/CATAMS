// @ts-ignore
import { request } from '@umijs/max';

// 获取某个课程的 tasks
export async function getTasksByUnit(unitId: number) {
  return request<API.ApiResponse<API.TaskDTO[]>>('/api/tasks/unit/${unitId}');
}

// Tutor 所有分配（unitId 可选）
export async function getTutorAllocations(unitId?: number) {
  return request<API.ApiResponse<API.AllocationResponse[]>>("/api/allocations/tutor", {
    method: "GET",
    params: unitId ? { unitId } : {},   // ✅ 注意不要拼空格
  });
}

// Tutor 的课程
export async function getTutorCourses() {
  return request<API.ApiResponse<API.TutorCourse[]>>("/api/tutor/courses", {
    method: "GET",
  });
}

export async function deleteAllocationsByTask(tutorId: number, taskId: number) {
  return request<API.ApiResponse<any>>(`/api/allocations`, {
    method: "DELETE",
    params: { tutorId, taskId },
  });
}

export async function getAllocations(unitId: number) {
  return request<API.ApiResponse<API.AllocationResponse[]>>(
    `/api/allocations?unitId=${unitId}`
  );
}


// ===== Allocations API =====
export async function saveTutorAllocations(data: API.SaveTutorAllocationsRequest) {
  return request<API.ApiResponse<any>>("/api/allocations", {
    method: "POST",
    data,
  });
}

// ===== TaskType API =====
export async function getTaskTypes(unitId: number) {
  return request<API.ApiResponse<any>>(`/api/task-types/unit/${unitId}`);
}

export async function createTaskType(data: { unitId: number; name: string }) {
  return request<API.ApiResponse<any>>("/api/task-types", {
    method: "POST",
    data,
  });
}

export async function updateTaskType(id: number, data: { name: string }) {
  return request<API.ApiResponse<any>>(`/api/task-types/${id}`, {
    method: "PUT",
    data,
  });
}

export async function deleteTaskType(id: number) {
  return request<API.ApiResponse<any>>(`/api/task-types/${id}`, {
    method: "DELETE",
  });
}

// ===== Task API =====
export async function getTasks(unitId: number) {
  return request<API.ApiResponse<any>>(`/api/tasks/unit/${unitId}`);
}

export async function createTask(data: { unitId: number; typeId: number; name: string }) {
  return request<API.ApiResponse<any>>("/api/tasks", {
    method: "POST",
    data,
  });
}

export async function updateTask(id: number, data: { typeId: number; name: string }) {
  return request<API.ApiResponse<any>>(`/api/tasks/${id}`, {
    method: "PUT",
    data,
  });
}

export async function deleteTask(id: number) {
  return request<API.ApiResponse<any>>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}
