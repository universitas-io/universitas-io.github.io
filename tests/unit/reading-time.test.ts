import { test, expect } from 'vitest';
import { readingTime } from '../../src/lib/reading-time';

test('readingTime calculates minutes correctly', () => {
  expect(readingTime('palavra '.repeat(400))).toBe(2);
  expect(readingTime('curto')).toBe(1);
  expect(readingTime('')).toBe(1);
  expect(readingTime('palavra '.repeat(201))).toBe(2);
  expect(readingTime('palavra '.repeat(199))).toBe(1);
});
