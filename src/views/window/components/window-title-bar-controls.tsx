import { Icons } from "@/common/icons";
import { cz } from "@lib/utils/cz";

const IconButton = ({
  active,
  disabled,
  children,
  onClick,
  disabledDisplayOnly,
}: {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabledDisplayOnly?: boolean;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "text-#fff cursor-pointer hover:opacity-80",
        active && "!text-#0cf",
        (disabled || disabledDisplayOnly) && "!opacity-30",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const windowTitleBarControlComponents = {
  SoloPlaybackButton({
    active,
    disabled,
    onClick,
  }: {
    active: boolean;
    disabled?: boolean;
    onClick: () => void;
  }) {
    return (
      <IconButton active={active} disabled={disabled} onClick={onClick}>
        <Icons.Play size={16} />
      </IconButton>
    );
  },
  ClockActiveButton({
    active,
    onClick,
  }: {
    active: boolean;
    onClick: () => void;
  }) {
    return (
      <IconButton disabledDisplayOnly={!active} onClick={onClick}>
        <Icons.Power size={16} />
      </IconButton>
    );
  },
};
