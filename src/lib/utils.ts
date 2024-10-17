import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: any): string => {
  if (!date) return 'Invalid Date';

  const parsedDate = date.toDate ? date.toDate() : new Date(date);

  if (isNaN(parsedDate.getTime())) return 'Invalid Date';

  return parsedDate
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\.$/, '')
    .replace(/ /g, '');
};
