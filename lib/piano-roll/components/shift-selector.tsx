import { cz } from "@lib/utils/cz";
import { SelectorOption } from "@lib/utils/selector-option";
import { ReactNode } from "react";
import { Icons } from "./icons";

export const ShifterFrame = ({
  children,
  onShift,
}: {
  children: ReactNode;
  onShift(dir: -1 | 1): void;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      onShift(-1);
    } else {
      onShift(1);
    }
  };
  return <div onClick={handleClick}>{children}</div>;
};

export const ShiftSelector = <T extends string | number>({
  options,
  value,
  onChange,
  minWidth = 60,
}: {
  options: SelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
  minWidth?: number;
}) => {
  const currentIndex = options.findIndex((option) => option.value === value);
  const currentOption = options[currentIndex];
  const canShiftLeft = currentIndex > 0;
  const canShiftRight = currentIndex < options.length - 1;

  const handleShift = (dir: -1 | 1) => {
    const newIndex = currentIndex + dir;
    if (newIndex < 0) return;
    if (newIndex >= options.length) return;
    onChange(options[newIndex].value);
  };
  return (
    <ShifterFrame onShift={handleShift}>
      <div
        className="flex-ha justify-between h-30px bg-#888 text-14px cursor-pointer"
        style={{ minWidth }}
      >
        <Icons.CaretLeft
          size={14}
          className={cz("-ml-px", !canShiftLeft && "invisible")}
        />
        <div>{currentOption?.label}</div>
        <Icons.CaretRight
          size={14}
          className={cz("-mr-px", !canShiftRight && "invisible")}
        />
      </div>
    </ShifterFrame>
  );
};
