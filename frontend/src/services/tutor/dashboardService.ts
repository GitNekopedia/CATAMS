import {request} from "@umijs/max";

export async function getTutorOverview(params?: any) {
  return request('/api/tutor/overview', { method: 'GET', params });
}
