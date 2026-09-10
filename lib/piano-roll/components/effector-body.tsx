import { ReactNode } from "react";
import { cz } from "../utils/cz";

export const EffectorBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cz("bg-clPanelBody p-4 text-white", className)}>
      {children}
    </div>
  );
};
