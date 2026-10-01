import { colorStyle } from "@lib/utils/color-style";
import { uiColors } from "../definitions/ui-theme";
import { DiatonicLanesEditorView } from "../editor/diatonic-lanes/diatonic-lanes-editor-view";
import { PatternEditorView } from "../editor/pattern/pattern-editor-view";
import { PianoRollEditorView } from "../editor/piano-roll/piano-roll-editor-view";
import { useStoreAccess } from "./app-context";
import { SideControlBar } from "./side-control-bar";
import { TopControlBar } from "./top-control-bar";

const PageRootInner = () => {
  const [{ isPatternView, diatonicLanesEnabled, sideControlsVisible }] =
    useStoreAccess();
  return (
    <div
      className="w-full h-full flex-vc gap-1 p-2 text-white"
      style={colorStyle({ bg: uiColors.clPanelBody })}
    >
      <TopControlBar />
      <div className="w-full grow flex-h gap-2 overflow-hidden">
        <div className="grow">
          {isPatternView && <PatternEditorView />}
          {!isPatternView && diatonicLanesEnabled && (
            <DiatonicLanesEditorView />
          )}
          {!isPatternView && !diatonicLanesEnabled && <PianoRollEditorView />}
        </div>
        {sideControlsVisible && <SideControlBar />}
      </div>
    </div>
  );
};

export const PageRoot = () => {
  const [{ viewActive }] = useStoreAccess();
  if (!viewActive) return null;
  return <PageRootInner />;
};
