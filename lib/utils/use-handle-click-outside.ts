import { useCallback, useEffect } from "react";

export function useHandleClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
) {
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const el = ref.current as HTMLElement;
      if (el && !el.contains(e.target as Node)) {
        callback();
        // e.stopPropagation();
      }
    },
    [ref, callback],
  );
  useEffect(() => {
    const base = document.body;
    base.addEventListener("pointerdown", handleClickOutside, { capture: true });
    return () => {
      base.removeEventListener("pointerdown", handleClickOutside, {
        capture: true,
      });
    };
  }, [handleClickOutside]);
}
