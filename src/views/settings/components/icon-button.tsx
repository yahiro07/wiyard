import { ButtonFrame } from "@lib/components/headless/button-frame";
import { cz } from "@lib/utils/cz";
import { IconType } from "react-icons";

export const IconButton = ({
  className,
  icon: IconComponent,
  size = 20,
  active,
  onClick,
}: {
  className?: string;
  icon: IconType;
  size?: number;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <ButtonFrame onClick={onClick}>
      <div
        className={cz(
          "text-#555 cursor-pointer",
          !active && "text-#bbb",
          "hover:opacity-80",
          className,
        )}
      >
        <IconComponent size={size} />
      </div>
    </ButtonFrame>
  );
};
