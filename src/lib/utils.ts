import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseDescription = (description: string) => {
  // 긴 문자열을 적절한 길이로 나누는 함수
  const splitLongString = (str: string, maxLength: number) => {
    const result = [];
    let currentLine = '';
    str.split(' ').forEach(word => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) result.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) result.push(currentLine);
    return result;
  };

  // 줄바꿈 문자로 먼저 나누고, 긴 줄은 다시 나눕니다
  const paragraphs = description
    .split(/\r\n|\r|\n/)
    .flatMap(para => splitLongString(para, 50)); // 50은 원하는 최대 줄 길이입니다

  return paragraphs
    .filter(paragraph => paragraph.trim() !== '')
    .map((paragraph, index) => {
      if (index === 0) {
        return { type: 'title', content: paragraph };
      } else if (paragraph.includes('*')) {
        return { type: 'info', content: paragraph };
      } else {
        return { type: 'paragraph', content: paragraph };
      }
    });
};
