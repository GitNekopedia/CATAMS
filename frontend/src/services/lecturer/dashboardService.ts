import {request} from "@umijs/max";

export async function getLecturerOverview(params?: any) {
  return request('/api/lecturer/overview', { method: 'GET', params });
}
