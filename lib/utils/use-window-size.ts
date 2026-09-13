import { useEffect, useState } from "react";
import { Size } from "./common-types";

export function useWindowSize(): Size {
  const [size, setSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const affectSize = () => {
      requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };
    window.addEventListener("resize", affectSize);
    window.addEventListener("orientationchange", affectSize);

    return () => {
      window.removeEventListener("resize", affectSize);
      window.removeEventListener("orientationchange", affectSize);
    };
  }, []);
  return size;
}
