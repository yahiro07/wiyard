import { checkArrayItemEquals } from "@/utils/helpers";

export function createSingleCache<T extends (...args: any[]) => any>(
  fn: T,
): {
  getCached(...args: Parameters<T>): ReturnType<T>;
  clear(): void;
} {
  type ResultValue = ReturnType<T>;
  let cache: { value: ResultValue; deps: any[] } | undefined;
  return {
    getCached(...args) {
      const deps = args;
      if (cache?.deps && checkArrayItemEquals(cache?.deps, deps)) {
        return cache.value;
      }
      const value = fn(...args);
      cache = { value, deps };
      return value;
    },
    clear() {
      cache = undefined;
    },
  };
}
