// frontend/src/utils/greeting.ts
import { useIntl } from '@umijs/max';

export function getGreeting(): string {
  const intl = useIntl();
  const hour = new Date().getHours();

  if (hour < 11) {
    return intl.formatMessage({ id: 'greeting.morning' });
  }
  if (hour < 13) {
    return intl.formatMessage({ id: 'greeting.noon' });
  }
  if (hour < 18) {
    return intl.formatMessage({ id: 'greeting.afternoon' });
  }
  return intl.formatMessage({ id: 'greeting.evening' });
}

