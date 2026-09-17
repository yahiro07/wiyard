import { ReactNode } from "react";

export const ButtonFrame = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <div onClick={onClick} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
};
