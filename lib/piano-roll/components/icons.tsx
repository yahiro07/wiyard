const IconImpl = ({
  className,
  spec,
  size,
}: {
  className?: string;
  spec: string;
  size?: number;
}) => {
  return (
    <i
      className={className ? [spec, className].join(" ") : spec}
      style={size ? { fontSize: `${size}px` } : undefined}
    />
  );
};

type IconProps = {
  className?: string;
  size?: number;
};
function iconHoc(spec: string) {
  return (props: IconProps) => <IconImpl spec={spec} {...props} />;
}

export const Icons = {
  CaretLeft: iconHoc("ri-arrow-left-s-line"),
  CaretRight: iconHoc("ri-arrow-right-s-line"),
  Trash: iconHoc("ri-delete-bin-line"),
};
