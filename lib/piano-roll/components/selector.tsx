import { cz } from "@lib/utils/cz";
import { SelectorOption } from "@lib/utils/selector-option";
import { HeadlessSelector } from "@lib/components/headless/headless-selector";

export const Selector = <T extends string | number>({
  className,
  options,
  value,
  onChange,
}: {
  className?: string;
  options: SelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) => {
  return (
    <HeadlessSelector
      className={cz(
        "flex-c h-30px bg-#888 font-bold text-12px text-white cursor-pointer",
        "outline-none text-center",
        className,
      )}
      options={options}
      value={value}
      onChange={onChange}
    />
  );
};
