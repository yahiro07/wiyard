import { cz } from "@lib/utils/cz";
import { ReactNode, useEffect, useRef } from "react";
import { ScrollBarH, ScrollBarV } from "../../components/scroll-bar";
import { useAppContext } from "../../model/app-context";
import { DisplaySpec } from "./editor-types";
import { DebugOverlay } from "./debug-overlay";
import { Size } from "@lib/utils/common-types";
import { useDomElementSize } from "@lib/utils/use-dom-element-size";
import { Icons } from "../../components/icons";

export const EditorCommonLayout = ({
  sideContent,
  mainContent,
  sideContentWidth,
  positionBarContent,
  mainDivSizeCallback,
}: {
  sideContent: ReactNode;
  mainContent: ReactNode;
  sideContentWidth: number;
  positionBarContent?: ReactNode;
  mainDivSizeCallback: (size: Size) => void;
}) => {
  const { store } = useAppContext();
  const { sight, isPatternView } = store.useSnapshot();
  const mainDivRef = useRef<HTMLDivElement>(null);
  const mainDivSize = useDomElementSize(mainDivRef);
  useEffect(() => {
    if (mainDivSize) {
      mainDivSizeCallback(mainDivSize);
    }
  }, [mainDivSize]);

  const hasXPadding = !isPatternView && sight.withXPadding;
  return (
    <div
      className={cz(
        "overflow-hidden relative",
        "w-full h-full grow",
        // "bg-#505054",
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
        <DebugOverlay />
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
      <div className="flex-c">
        <div className={cz("h-full", hasXPadding ? "w-92.4%" : "w-full")}>
          <ScrollBarH
            trackOffset={sight.xBarPosition}
            trackLength={sight.wBars}
            fullLength={16}
            step={1}
            onChange={(v) => {
              store.setSight({ ...sight, xBarPosition: v });
            }}
            disabledWithNoTrack={sight.wBars === 16 || isPatternView}
          />
        </div>
      </div>
      <div className="flex-c">
        <button
          className="cursor-pointer text-#999"
          onClick={store.toggleSideControlsVisible}
        >
          <Icons.RightSideBar />
        </button>
      </div>
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
