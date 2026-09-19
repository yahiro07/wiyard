import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";

export const LabeledBox = ({
  className,
  label,
  children,
  labelAlign = "center",
  width,
  contentHeight = 40,
}: {
  className?: string;
  label?: string;
  labelAlign?: "left" | "center" | "right";
  children?: ReactNode;
  width?: number;
  contentHeight?: number;
}) => {
  return (
    <div
      className={cz("flex-v", className)}
      style={width ? { width } : undefined}
    >
      <div
        className="text-11px font-500 h-13px"
        style={{ textAlign: labelAlign }}
      >
        {label}
      </div>
      <div className="flex-c" style={{ height: contentHeight }}>
        {children}
      </div>
    </div>
  );
};
