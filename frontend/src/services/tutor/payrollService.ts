import { request } from '@umijs/max';

/**
 * 获取Tutor本月工资
 * @param month yyyy-MM 格式
 */
export async function getTutorMonthlyIncome(month?: string) {
  return request<API.TutorIncome>('/api/payroll/income/monthly', {
    method: 'GET',
    params: { month },
  });
}

/**
 * 获取Tutor本月工资明细
 * @param month yyyy-MM 格式
 */
// Tutor 收入明细（新增）
export async function getTutorMonthlyIncomeDetail(month: string) {
  return request<API.TutorIncomeDetail[]>('/api/payroll/income/detail', {
    method: 'GET',
    params: { month },
  });
}

/** 获取 Tutor 年度收入趋势 */
export async function getTutorYearlyIncome(year: string) {
  return request<API.TutorIncomeTrend[]>('/api/payroll/income/yearly', {
    method: 'GET',
    params: { year },
  });
}
