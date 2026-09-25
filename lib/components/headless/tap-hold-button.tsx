import React, { ReactNode } from "react";
import { startDragSessionEx } from "../../utils/drag-session";

export const TapHoldButtonFrame = ({
  children,
  onTap,
  onHold,
  disabled,
}: {
  children: ReactNode;
  onTap: () => void;
  onHold: () => void;
  disabled?: boolean;
}) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    startDragSessionEx(e, {
      onTap,
      onHold,
    });
  };
  return (
    <button
      onPointerDown={handlePointerDown}
      disabled={disabled}
      style={!disabled ? { cursor: "pointer" } : { pointerEvents: "none" }}
    >
      {children}
    </button>
  );
};
