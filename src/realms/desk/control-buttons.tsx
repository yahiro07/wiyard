import { Icons } from "@/common/icons";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";

const ControlButton = ({
  text,
  children,
  onClick,
  disabled,
}: {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "flex-c text-2xl w-40px h-30px cursor-pointer",
        disabled && "opacity-30 pointer-events-none",
      )}
      onClick={onClick}
    >
      {text}
      {children}
    </button>
  );
};

export const ControlButtons = ({ vertical }: { vertical?: boolean }) => {
  const { currentEffectUnitId, sequencerWindowVisible } = store.useSnapshot();
  const hasWindow = currentEffectUnitId || sequencerWindowVisible;
  return (
    <div className={cz(vertical ? "flex-v" : "flex-h", "gap-2")}>
      <ControlButton
        text="+"
        onClick={() => actions.setUnitPickerVisible(true)}
      />
      <ControlButton
        onClick={actions.toggleWindowsEvacuated}
        disabled={!hasWindow}
        children={<Icons.DisplayFullWidth />}
      />
    </div>
  );
};
