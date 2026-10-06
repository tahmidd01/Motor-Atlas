export const validIds = (value: unknown, allowed: Set<string>, limit = Infinity): string[] =>
  Array.isArray(value)
    ? [...new Set(value.filter((x): x is string => typeof x === 'string' && allowed.has(x)))].slice(
        0,
        limit,
      )
    : [];
export function readStoredIds(key: string, allowed: Set<string>, limit = Infinity) {
  try {
    return validIds(JSON.parse(localStorage.getItem(key) ?? '[]'), allowed, limit);
  } catch {
    return [];
  }
}
export function writeStoredIds(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}
