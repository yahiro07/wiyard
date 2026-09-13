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
  options?: { skipUndefined?: boolean },
): Pick<T, K> {
  const fieldNames = Array.isArray(keys) ? keys : (Object.keys(keys) as K[]);
  const destObj: Pick<T, K> = {} as Pick<T, K>;
  for (const key of fieldNames) {
    const value = obj[key];
    if (value === undefined && options?.skipUndefined) continue;
    destObj[key] = value;
  }
  return destObj;
}

export function mapObjectValues<T, R>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => R,
) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value, key)]),
  );
}
