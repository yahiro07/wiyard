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
  positionBarContent,
}: {
  sideContent: ReactNode;
  mainContent: ReactNode;
  mainDivRef: React.RefObject<HTMLDivElement | null>;
  sideContentWidth: number;
  positionBarContent?: ReactNode;
}) => {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  return (
    <div
      className={cz(
        "overflow-hidden relative",
        "w-full h-full grow",
        "[&>div]:overflow-hidden",
      )}
      style={{
        display: "grid",
        gridTemplateColumns: `${sideContentWidth}px 1fr 22px`,
        gridTemplateRows: "24px 1fr 22px",
      }}
    >
      <div></div>
      <div>{positionBarContent}</div>
      <div></div>
      <div>{sideContent}</div>
      <div className="relative" ref={mainDivRef}>
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
      <div className="flex-h">
        {sight.withXPadding && <div className="w-5.9%" />}
        <div className="grow h-full">
          <ScrollBarH
            trackOffset={sight.xBarPosition}
            trackLength={sight.wBars}
            fullLength={16}
            step={1}
            onChange={(v) => {
              store.setSight({ ...sight, xBarPosition: v });
            }}
          />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export const HorizontalScrollPlane = ({
  displaySpec,
  height,
  children,
}: {
  displaySpec: DisplaySpec;
  height?: number | string;
  children: React.ReactNode;
}) => {
  const { contentW, tx } = displaySpec;
  return (
    <div
      className="relative"
      style={{ width: contentW, height, transform: `translateX(${tx}px)` }}
    >
      {children}
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
  const { contentH } = displaySpec;
  return (
    <HorizontalScrollPlane displaySpec={displaySpec} height={contentH}>
      {children}
    </HorizontalScrollPlane>
  );
};
