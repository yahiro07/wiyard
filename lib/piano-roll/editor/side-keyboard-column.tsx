import { useState } from "react";
import { noteNameLabels, uiConfig } from "../definitions/ui-config";
import { useAppContext } from "../root/app-context";
import { cz } from "../utils/cz";
import { startDragSession } from "../utils/drag-session-v0";
import { seqNumbers } from "../utils/helpers";

const keyTypes = [
  "whiteL",
  "black",
  "whiteM",
  "black",
  "whiteH",
  "whiteL",
  "black",
  "whiteM",
  "black",
  "whiteM",
  "black",
  "whiteH",
];

function getKeyStyle(subIndex: number, cellH: number) {
  const keyType = keyTypes[subIndex];
  const keyStyle: Record<string, any> = {
    width: "100%",
    background: "#fff",
    height: cellH,
    left: 0,
  };
  if (keyType === "whiteL") {
    keyStyle.height += cellH / 2;
    keyStyle.bottom = 0;
  } else if (keyType === "whiteM") {
    keyStyle.height += cellH;
    keyStyle.top = 0;
    keyStyle.bottom = 0;
    keyStyle.margin = "auto 0";
  } else if (keyType === "whiteH") {
    keyStyle.height += cellH / 2;
    keyStyle.top = 0;
  } else if (keyType === "black") {
    keyStyle.zIndex = 1;
    keyStyle.width = "63%";
    keyStyle.background = "linear-gradient(to right, #222, #666)";
    keyStyle.top = 0;
    keyStyle.bottom = 0;
    keyStyle.margin = "auto 0";
  }
  const withBottomBorder = subIndex === 0 || subIndex === 5;
  if (withBottomBorder) {
    keyStyle.borderBottom = `solid 0.5px #0003`;
  }
  if (subIndex === 0) {
    keyStyle.background = "#e4e4e4";
  }
  return keyStyle;
}

const KeyboardKey = ({ yi, cellH }: { yi: number; cellH: number }) => {
  const { store } = useAppContext();

  const subIndex = yi % 12;
  const label = subIndex === 0 && noteNameLabels[yi];
  const [pressed, setPressed] = useState(false);

  const keyStyle = getKeyStyle(subIndex, cellH);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setPressed(true);
    store.setPreviewNotePitch(yi);
    startDragSession(e.nativeEvent, {
      onUpOrCancel() {
        setPressed(false);
        store.setPreviewNotePitch(null);
      },
    });
  };

  const styles = keyboardKeyStyles;
  return (
    <div className={styles.base} style={{ height: cellH }}>
      <div
        className={cz(styles.inner, pressed && styles.innerPressed)}
        style={keyStyle}
        onPointerDown={handlePointerDown}
      >
        {label && <div className={styles.label}>{label}</div>}
      </div>
    </div>
  );
};
const keyboardKeyStyles = {
  base: cz("relative pointer-events-none"),
  inner: cz("absolute pointer-events-auto cursor-pointer"),
  innerPressed: "bg-#4dd!",
  label: cz(
    "flex-ha h-full justify-end p-1",
    "text-#666 text-12px",
    "font-monospace",
  ),
};

export const SideKeyboardColumn = ({
  width,
  cellH,
}: {
  width: number;
  cellH: number;
}) => {
  const { numKeys } = uiConfig;
  return (
    <div className="shrink-0" style={{ width }}>
      {seqNumbers(numKeys).map((i) => (
        <KeyboardKey key={i} yi={numKeys - i - 1} cellH={cellH} />
      ))}
    </div>
  );
};
