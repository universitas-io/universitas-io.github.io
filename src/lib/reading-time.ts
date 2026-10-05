export function readingTime(text: string): number {
  if (!text || typeof text !== 'string') return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / 200));
}
