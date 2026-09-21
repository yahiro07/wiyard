import { useCallback, useEffect } from "react";

export function useHandleClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  options?: {
    withPropagation?: boolean;
    targetMethod?: "click" | "pointerdown";
  },
) {
  const targetMethod = options?.targetMethod ?? "pointerdown";
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const el = ref.current as HTMLElement;
      if (el && !el.contains(e.target as Node)) {
        callback();
        if (options?.withPropagation) {
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
