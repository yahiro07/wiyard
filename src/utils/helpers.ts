export function checkArrayItemEquals<T>(a: T[], b: T[]) {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

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

export function AddOrRemoveArrayItem<T>(array: T[], value: T): T[] {
  const index = array.indexOf(value);
  if (index === -1) {
    return [...array, value];
  } else {
    return array.filter((item) => item !== value);
  }
}

export function pickObjectMembers<T extends {}, K extends keyof T>(
  obj: T,
  keys: K[] | Record<K, 1 | true>,
): Pick<T, K> {
  const fieldNames = Array.isArray(keys) ? keys : (Object.keys(keys) as K[]);
  return Object.fromEntries(
    fieldNames.map((fieldName) => [fieldName, obj[fieldName]]),
  ) as Pick<T, K>;
}

export function mapObjectValues<T, R>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => R,
) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value, key)]),
  );
}

export function safeParseInt(text: string, defaultValue: number) {
  const res = parseInt(text, 10);
  return Number.isFinite(res) ? res : defaultValue;
}
