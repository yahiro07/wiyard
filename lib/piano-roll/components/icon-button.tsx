import { ReactNode } from "react";
import { cz } from "../utils/cz";

export const IconButton = ({
  className,
  children,
  disabled,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "[all:unset] mt-3 bg-transparent text-white p-2 cursor-pointer",
        disabled && "opacity-30 pointer-events-none",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
