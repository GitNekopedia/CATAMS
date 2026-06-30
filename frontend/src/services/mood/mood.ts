import { request } from '@umijs/max';
import Mood = API.Mood;
import MoodStat = API.MoodStat;

// 获取指定日期的所有 mood 记录
export async function getMoodOfDay(date: string) {
  return request('/api/mood/day', { params: { date } });
}

// 获取所有记录（历史页用）
export async function getMoodList(): Promise<Mood[]> {
  return request('/api/mood/list');
}

// 提交心情记录
export async function recordMood(params: { score: number; desc: string; date: string}) {
  return request('/api/mood/record', {
    method: 'POST',
    params,
  });
}

// 月 / 年趋势统计
export async function getMoodStats(type: 'day' | 'month' | 'year', date: string): Promise<MoodStat[]> {
  return request('/api/mood/stats', { params: { type, date } });
}



