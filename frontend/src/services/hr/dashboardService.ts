import { request } from '@umijs/max';

export async function getHrOverview() {
  return request<API.HrOverview>('/api/hr/dashboard/overview', {
    method: 'GET',
  });
}
