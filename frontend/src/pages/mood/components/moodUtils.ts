import Mood = API.Mood;
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * ✅ 格式化为本地时间（把数据库 UTC 转成本地时区时间）
 * @param utcString 服务器返回的 UTC 时间
 * @param format 格式字符串（默认 'YYYY-MM-DD HH:mm:ss'）
 */
export function formatLocalTime(utcString?: string, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!utcString) return '';
  return dayjs.utc(utcString).local().format(format);
}

/**
 * ✅ 获取今日日期字符串（YYYY-MM-DD）
 */
export function getToday(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * ✅ 判断是否是今日
 */
export function isToday(date: string): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}


/**
 * 计算本月心情概览
 */
export function calcMonthlySummary(records: Mood[]) {
  if (!records?.length)
    return { avgMood: 0, maxMoodDay: null, minMoodDay: null, streakDays: 0 };

  const month = dayjs().format('YYYY-MM');
  const monthRecords = records.filter((r) => r.recordDate.startsWith(month));

  if (!monthRecords.length)
    return { avgMood: 0, maxMoodDay: null, minMoodDay: null, streakDays: 0 };

  const avgMood =
    monthRecords.reduce((sum, r) => sum + r.moodScore, 0) / monthRecords.length;

  const maxMoodDay = monthRecords.reduce((a, b) =>
    a.moodScore > b.moodScore ? a : b
  );
  const minMoodDay = monthRecords.reduce((a, b) =>
    a.moodScore < b.moodScore ? a : b
  );

  const uniqueDays = new Set(monthRecords.map((r) => r.recordDate));
  const streakDays = uniqueDays.size;

  return { avgMood, maxMoodDay, minMoodDay, streakDays };
}
