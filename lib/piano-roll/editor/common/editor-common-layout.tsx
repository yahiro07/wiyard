import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";
import { ScrollBarH, ScrollBarV } from "../../components/scroll-bar";
import { useAppContext } from "../../root/app-context";

export const EditorCommonLayout = ({
  sideContent,
  mainContent,
  measuredDivRef,
  sideContentWidth,
}: {
  sideContent: ReactNode;
  mainContent: ReactNode;
  measuredDivRef: React.RefObject<HTMLDivElement | null>;
  sideContentWidth: number;
}) => {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  return (
    <div
      className={cz("overflow-hidden relative -mt-4", "w-full grow")}
      style={{
        display: "grid",
        gridTemplateColumns: `${sideContentWidth}px 1fr 24px`,
        gridTemplateRows: "20px 1fr 24px",
      }}
    >
      <div></div>
      <div></div>
      <div></div>
      <div className="overflow-hidden">{sideContent}</div>
      <div className="overflow-hidden relative" ref={measuredDivRef}>
        {mainContent}
      </div>
      <div>
        <ScrollBarV
          position={sight.yPosition}
          onChange={(v) => {
            store.setSight({ ...sight, yPosition: v });
          }}
        />
      </div>
      <div></div>
      <div>
        <ScrollBarH
          position={sight.xPosition}
          onChange={(v) => {
            store.setSight({ ...sight, xPosition: v });
          }}
        />
      </div>
      <div></div>
    </div>
  );
};
