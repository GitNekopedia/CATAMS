export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return '早安';
  if (hour < 13) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}
