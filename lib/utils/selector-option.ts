export type SelectorOption<T extends string | number> = {
  label: string;
  value: T;
};

export function createPlainSelectorOptions<T extends string | number>(
  values: T[],
): SelectorOption<T>[] {
  return values.map((v) => ({ label: v.toString(), value: v }));
}

export function createSelectorOptions<T extends string | number>(
  source: [T, string][],
): SelectorOption<T>[] {
  return source.map(([value, label]) => ({ label, value }));
}
