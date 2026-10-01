import { SelectorOption } from "@lib/utils/selector-option";
import { useMemo } from "react";

type Props<T extends string | number> = {
  options: SelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
  reverseOptionsOrder?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function GeneralSelector<T extends string | number>({
  options,
  value,
  onChange,
  reverseOptionsOrder = false,
  className,
  style,
}: Props<T>) {
  const orderedOptions = useMemo(() => {
    if (reverseOptionsOrder) {
      return [...options].reverse();
    }
    return options;
  }, [options, reverseOptionsOrder]);

  const wrapOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isNumber = typeof options[0].value === "number";
    const newValue = isNumber ? parseFloat(e.target.value) : e.target.value;
    onChange(newValue as T);
  };
  return (
    <select
      value={value}
      onChange={wrapOnChange}
      className={className}
      style={style}
    >
      {orderedOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
