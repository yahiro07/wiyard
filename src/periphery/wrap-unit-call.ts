let prevMessage: string | undefined;

function handleError(error: any) {
  const message =
    error != null && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : String(error);
  if (message !== prevMessage) {
    console.warn(error);
    prevMessage = message;
  } else {
    console.log("same error");
  }
}

export function wrapUnitCall<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch (error) {
    handleError(error);
  }
}

export function safeInvoke<T extends (...args: any[]) => any>(
  fn: T | undefined,
): T | undefined {
  if (fn) {
    return ((...args: Parameters<T>) => {
      try {
        return fn(...args);
      } catch (error) {
        handleError(error);
      }
    }) as T;
  }
}
