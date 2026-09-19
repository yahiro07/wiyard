import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";

export const IconButton = ({
  className,
  children,
  disabled,
  onClick,
  active,
}: {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  active?: boolean;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "bg-transparent text-white p-2 cursor-pointer",
        !disabled && active && "!text-#7af",
        disabled && "opacity-30 pointer-events-none",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
