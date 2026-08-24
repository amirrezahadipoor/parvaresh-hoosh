// تنها نقطهٔ ورود به درس‌ها. هر درسی که در برنامه دیده می‌شود از اینجا می‌آید.

import { READING_LESSONS } from './reading.js';
import { MATH_LESSONS } from './math.js';
import { LOGIC_LESSONS } from './logic.js';
import { ENGLISH_LESSONS } from './english.js';
import { SCIENCE_LESSONS } from './science.js';
import { LIFE_LESSONS } from './life.js';

export const LESSONS = Object.freeze([
  ...READING_LESSONS,
  ...MATH_LESSONS,
  ...SCIENCE_LESSONS,
  ...ENGLISH_LESSONS,
  ...LIFE_LESSONS,
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
  'blend-word',
  'segment-count',
  'syllable-build',
  'count-letters',
  'count-objects',
  'pick-number',
  'next-number',
  'subitize',
  'ten-frame',
  'number-bond',
  'make-ten',
  'story-problem',
  'compare-groups',
  'compare-numbers',
  'add',
  'sub',
  'digit-trace',
  'tally',
  'skip-count',
  'place-value',
  'number-line',
  'between',
  'teen-build',
  'measure-units',
  'ordinal',
  'shape-corners',
  'symmetry',
  'missing-addend',
  'pattern-next',
  'pattern-make',
  'bigger-smaller',
  'odd-one-out',
  'order-size',
  'two-rule',
  'not-rule',
  'event-order',
  'what-if',
  'same-different',
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
  'en-sight-find',
  'en-rime-build',
  'living',
  'life-cycle',
  'life-cycle-next',
  'season',
  'weather-need',
  'weather-name',
  'needs',
  'habitat',
  'sense',
  'float-sink',
  'en-translate',
  'feel-face',
  'name-face',
  'safe-pick',
  'problem-solve',
  'feeling-fix',
  'good-habit',
  'safety-order',
]);
