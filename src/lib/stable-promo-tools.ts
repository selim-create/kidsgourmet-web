/**
 * Select a stable subset of promotional tools for server and client renders.
 * Pure seeded shuffle: identical inputs yield identical output and no duplicates.
 */
export function selectStablePromoTools<T>(
  tools: readonly T[],
  seed: string,
  count = 4
): T[] {
  let state = Array.from(seed).reduce(
    (hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0,
    2166136261
  );
  const shuffled = [...tools];

  for (let index = shuffled.length - 1; index > 0; index--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const nextIndex = state % (index + 1);
    [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[index]];
  }

  return shuffled.slice(0, Math.max(0, count));
}
