import { ReactNode } from "react";
import { uiColors } from "../definitions/ui-theme";
import { colorStyle } from "../utils/color-style";
import { cz } from "../utils/cz";

export const EffectorBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cz("p-4 text-white", className)}
      style={colorStyle({ bg: uiColors.clPanelBody })}
    >
      {children}
    </div>
  );
};
