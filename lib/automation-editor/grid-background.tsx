const colors = {
  border: "#222",
  bg: "#444",
  bgAlt: "#282828",
};
export const GridBackground = ({
  className,
  nx,
  ny,
  bgAlterStrideX,
}: {
  className?: string;
  nx: number;
  ny: number;
  bgAlterStrideX?: number;
}) => {
  const bgAlterStride = bgAlterStrideX ?? 0;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: `solid 0.5px ${colors.border}`,
      }}
    >
      {Array.from({ length: nx * ny }).map((_, i) => {
        const xi = i % nx;
        const yi = Math.floor(i / nx);
        const bgAlt = xi % (bgAlterStride * 2) < bgAlterStride;
        return (
          <div
            key={`${xi}-${yi}`}
            style={{
              position: "absolute",
              width: `${100 / nx}%`,
              height: `${100 / ny}%`,
              border: `solid 0.5px ${colors.border}`,
              left: `${(xi * 100) / nx}%`,
              top: `${(yi * 100) / ny}%`,
              backgroundColor: bgAlt ? colors.bgAlt : colors.bg,
            }}
          />
        );
      })}
    </div>
  );
};
