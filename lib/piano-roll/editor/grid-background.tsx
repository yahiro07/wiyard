import { uiConfig } from "../definitions/ui-config";
import { cz } from "../utils/cz";
import "./grid-background-styles.css";

export const GridBackground = ({
  nx,
  ny,
  width,
  height,
}: {
  nx: number;
  ny: number;
  width: number;
  height: number;
}) => {
  const { cellW, cellH } = uiConfig;
  return (
    <div className="grid-background-root" style={{ width, height }}>
      {Array.from({ length: nx * ny }).map((_, i) => {
        const xi = i % nx;
        const yi = Math.floor(i / nx);
        const x = xi * cellW;
        const y = yi * cellH;
        const subNoteIndex = (ny - yi - 1) % 12;
        const isBlackKey = [1, 3, 6, 8, 10].includes(subNoteIndex);

        let borderStrength = "default";
        if (xi % 4 === 3) {
          borderStrength = "stronger1";
        }
        if (xi === 15) {
          borderStrength = "stronger2";
        }
        const hasBottomBorder = subNoteIndex === 0 || subNoteIndex === 5;
        return (
          <div
            key={`${xi}-${yi}`}
            className={cz(
              hasBottomBorder && "--has-bottom-border",
              isBlackKey && "--is-black-key",
              `--border-${borderStrength}`,
            )}
            style={{ left: x, top: y, width: cellW, height: cellH }}
          />
        );
      })}
    </div>
  );
};
