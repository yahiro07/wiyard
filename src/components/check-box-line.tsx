import { Icons } from "@/common/icons";
import { cz } from "@lib/utils/cz";

export const CheckBoxLine = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}) => {
  return (
    <label className="flex-ha gap-1">
      <button
        className={cz(styles.base, checked && styles.active)}
        onClick={() => onChange?.(!checked)}
      >
        <Icons.Check />
      </button>
      <span>{label}</span>
    </label>
  );
};
const styles = {
  base: cz(
    "w-20px h-20px rounded-3px bg-gray-400 cursor-pointer",
    "flex-c text-white",
  ),
  active: "!bg-#8ae text-white",
};
