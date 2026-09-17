export function resultOf<T>(fn: () => T): T {
  return fn();
}

export function tryParseJson<T>(text: string, errorCallback: () => never): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    errorCallback();
  }
}

export function tryParseJsonOrNull<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
