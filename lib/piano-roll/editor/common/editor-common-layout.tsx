import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";
import { ScrollBarH, ScrollBarV } from "../../components/scroll-bar";
import { useAppContext } from "../../root/app-context";
import { DisplaySpec } from "./editor-types";

export const EditorCommonLayout = ({
  sideContent,
  mainContent,
  mainDivRef,
  sideContentWidth,
}: {
  sideContent: ReactNode;
  mainContent: ReactNode;
  mainDivRef: React.RefObject<HTMLDivElement | null>;
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
      <div>aa</div>
      <div></div>
      <div className="overflow-hidden">{sideContent}</div>
      <div className="overflow-hidden relative" ref={mainDivRef}>
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

export const PianoRollEditPartPlane = ({
  displaySpec,
  children,
}: {
  displaySpec: DisplaySpec;
  children: ReactNode;
}) => {
  const { contentW, contentH, tx } = displaySpec;
  return (
    <div className={cz("overflow-hidden")}>
      <div
        className="relative flex-h"
        style={{
          width: contentW,
          height: contentH,
          transform: `translateX(${tx}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
