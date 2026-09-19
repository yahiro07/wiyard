import { useEffect, useRef, useState } from "react";

export function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export function useInstance<T>(fn: () => T) {
  return useState(fn)[0];
}
