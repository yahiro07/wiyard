import { Icons } from "@/common/icons";
import { cz } from "@lib/utils/cz";

export const CheckBox = ({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) => {
  return (
    <button
      className={cz(styles.base, checked && styles.active)}
      onClick={() => onChange?.(!checked)}
    >
      <Icons.Check />
    </button>
  );
};

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
    <div className="flex-ha gap-1">
      <CheckBox checked={checked} onChange={onChange} />
      <label>{label}</label>
    </div>
  );
};
const styles = {
  base: cz(
    "w-20px h-20px rounded-3px bg-gray-400 cursor-pointer",
    "flex-c text-white",
  ),
  active: "!bg-#8ae text-white",
};
