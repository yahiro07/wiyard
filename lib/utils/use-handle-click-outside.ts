import { useCallback, useEffect } from "react";

export function useHandleClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  options?: {
    withStopPropagation?: boolean;
    targetMethod?: "click" | "pointerdown";
    excludeButtons?: boolean;
  },
) {
  const targetMethod = options?.targetMethod ?? "pointerdown";
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const el = ref.current as HTMLElement;
      if (el && !el.contains(e.target as Node)) {
        if (
          options?.excludeButtons &&
          e.target instanceof Element &&
          e.target.closest("button")
        ) {
          return;
        }
        callback();
        if (options?.withStopPropagation) {
          e.stopPropagation();
        }
      }
    },
    [ref, callback],
  );
  useEffect(() => {
    const base = document.body;
    base.addEventListener(targetMethod, handleClickOutside, { capture: true });
    return () => {
      base.removeEventListener(targetMethod, handleClickOutside, {
        capture: true,
      });
    };
  }, [handleClickOutside]);
}
