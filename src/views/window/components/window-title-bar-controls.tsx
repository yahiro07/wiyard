import { Icons } from "@/common/icons";
import { cz } from "@lib/utils/cz";

export const windowTitleBarControlComponents = {
  SoloPlaybackButton(props: {
    active: boolean;
    disabled?: boolean;
    onClick: () => void;
  }) {
    const { active, disabled, onClick } = props;
    return (
      <button
        type="button"
        className={cz(
          "text-#fff cursor-pointer hover:opacity-80",
          active && "!text-#0cf",
          disabled && "!opacity-30",
        )}
        onClick={onClick}
        disabled={disabled}
      >
        <Icons.Play size={16} />
      </button>
    );
  },
};
