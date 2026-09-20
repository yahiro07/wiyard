import React, { ReactNode } from "react";
import { startDragSessionEx } from "../../utils/drag-session";

export const TapHoldButtonFrame = ({
  children,
  onTap,
  onHold,
}: {
  children: ReactNode;
  onTap: () => void;
  onHold: () => void;
}) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    startDragSessionEx(e, {
      onTap,
      onHold,
    });
  };
  return (
    <div onPointerDown={handlePointerDown} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
};
