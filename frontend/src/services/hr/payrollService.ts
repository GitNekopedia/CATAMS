import { request } from '@umijs/max';

/**
 * 查询 HR 端 Tutor 工资汇总
 */
export async function getHrMonthlyIncome(params: { month?: string; tutorId?: number }) {
  return request<API.TutorIncome[]>('/api/payroll/income/monthly', {
    method: 'GET',
    params,
  });
}

/**
 * 获取 Tutor 列表（复用现有接口）
 */
export async function getTutorList() {
  return request<API.UserEntity[]>('/api/user/list', {
    method: 'GET',
    params: { role: 'Tutor' },
  });
}

/**
 * 查询 HR 端 Tutor 工资明细
 */
export async function getHrMonthlyIncomeDetail(params: { month: string; tutorId?: number }) {
  return request<API.TutorIncomeDetail[]>('/api/payroll/income/detail', {
    method: 'GET',
    params,
  });
}

