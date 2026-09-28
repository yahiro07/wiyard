export const ColorEditButton = ({
  color,
  onChange,
  size = 26,
}: {
  color: string;
  onChange: (color: string) => void;
  size?: number;
}) => {
  if (color.length === 4) {
    const [_, r, g, b] = color.split("");
    color = `#${r}${r}${g}${g}${b}${b}`;
  }
  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        background: color,
      }}
    >
      <input
        type="color"
        className="size-full opacity-0 cursor-pointer"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
