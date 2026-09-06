export function setOrDeleteValue<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K] | null,
) {
  if (value !== null) {
    obj[key] = value;
  } else {
    delete obj[key];
  }
}

export function checkArrayItemEquals<T>(a: T[], b: T[]) {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

export function mapObjectValues<T, R>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => R,
) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value, key)]),
  );
}
