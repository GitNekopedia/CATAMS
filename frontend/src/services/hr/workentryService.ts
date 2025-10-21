import { request } from '@umijs/max';

/** HR 获取所有工时记录 */
export async function getAllHREntries() {
  return request('/api/hr/work-entries/all', { method: 'GET' });
}
