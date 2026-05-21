import { format, formatDistanceToNow, isToday, isYesterday, differenceInDays } from 'date-fns';

export const todayStr = () => new Date().toISOString().split('T')[0];

export const formatDate = (isoString) => {
  if (!isoString) return '';
  return format(new Date(isoString), 'MMM d, yyyy');
};

export const formatDateShort = (isoString) => {
  if (!isoString) return '';
  return format(new Date(isoString), 'MMM d');
};

export const timeAgo = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDistanceToNow(date, { addSuffix: true });
};

export const daysUntil = (isoString) => {
  if (!isoString) return 0;
  return differenceInDays(new Date(isoString), new Date());
};

export const daysAgo = (isoString) => {
  if (!isoString) return 0;
  return differenceInDays(new Date(), new Date(isoString));
};
