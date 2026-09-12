import { useLayoutEffect, useState } from "react";
import { Size } from "../../utils/common-types";

function setupDomSizeAffecter(
  element: HTMLElement,
  destFn: (size: Size) => void,
) {
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (entry) {
      const { width, height } = entry.contentRect;
      destFn({ width, height });
    }
  });
  observer.observe(element);
  return () => {
    observer.unobserve(element);
    observer.disconnect();
  };
}

export function useDomElementSize(
  ref: React.RefObject<HTMLElement | null>,
): Size | undefined {
  const [size, setSize] = useState<Size | undefined>();
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      return setupDomSizeAffecter(el, setSize);
    }
  }, [ref]);
  return size;
}
