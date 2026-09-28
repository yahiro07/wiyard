import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";

export const Button = ({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) => {
  const styles = {
    base: "px-1 h-28px rounded-3px bg-gray-400 min-w-34px cursor-pointer text-12px font-500",
    active: "!bg-#8ae text-white",
    disabled: "opacity-30 pointer-events-none",
  };
  return (
    <button
      className={cz(
        styles.base,
        active && styles.active,
        disabled && styles.disabled,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
