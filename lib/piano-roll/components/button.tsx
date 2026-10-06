import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";

export const Button = ({
  text,
  children,
  active,
  disabled,
  onClick,
}: {
  text?: string;
  children?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cz(
        "flex-c w-50px h-30px bg-#888 font-600 text-white cursor-pointer",
        active && "!bg-#48c",
        disabled && "opacity-40 pointer-events-none",
      )}
      onClick={onClick}
    >
      {text && <div className="text-11px">{text}</div>}
      {children}
    </div>
  );
};
