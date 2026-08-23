// تنها نقطهٔ ورود به درس‌ها. هر درسی که در برنامه دیده می‌شود از اینجا می‌آید.

import { READING_LESSONS } from './reading.js';
import { MATH_LESSONS } from './math.js';
import { LOGIC_LESSONS } from './logic.js';
import { ENGLISH_LESSONS } from './english.js';
import { SCIENCE_LESSONS } from './science.js';

export const LESSONS = Object.freeze([
  ...READING_LESSONS,
  ...MATH_LESSONS,
  ...SCIENCE_LESSONS,
  ...ENGLISH_LESSONS,
  ...LOGIC_LESSONS,
]);

export function lessonsByDomain(domainId) {
  return LESSONS.filter((l) => l.domain === domainId).sort((a, b) => a.order - b.order);
}

export function lessonById(id) {
  return LESSONS.find((l) => l.id === id) || null;
}

// انواع گِردی که موتور بازی واقعاً پیاده‌سازی کرده است.
// اعتبارسنج مطمئن می‌شود هیچ درسی نوعی خارج از این فهرست نخواهد.
export const SUPPORTED_ROUND_KINDS = Object.freeze([
  'letter-sound',
  'letter-trace',
  'letter-word',
  'letter-in-word',
  'count-letters',
  'count-objects',
  'pick-number',
  'next-number',
  'subitize',
  'ten-frame',
  'number-bond',
  'compare-groups',
  'compare-numbers',
  'add',
  'sub',
  'pattern-next',
  'odd-one-out',
  'order-size',
  'order-number',
  'memory-pairs',
  'shape-color',
  'category',
  'trait',
  'which-group',
  'count-group',
  'shadow',
  'count-shapes',
  'en-letter-pic',
  'en-word-pic',
  'en-pic-word',
  'en-color',
  'en-number',
  'en-cvc',
  'en-translate',
]);
