import { Icons } from "@/common/icons";
import { actions } from "@/store/actions";
import { cz } from "@/utils/cz";

const ControlButton = ({
  text,
  children,
  onClick,
}: {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      className="flex-c text-2xl w-40px h-30px cursor-pointer"
      onClick={onClick}
    >
      {text}
      {children}
    </button>
  );
};

export const ControlButtons = ({ vertical }: { vertical?: boolean }) => {
  return (
    <div className={cz(vertical ? "flex-v" : "flex-h", "gap-2")}>
      <ControlButton text="+" />
      <ControlButton onClick={actions.toggleWindowsEvacuated}>
        <Icons.DisplayFullWidth />
      </ControlButton>
    </div>
  );
};
