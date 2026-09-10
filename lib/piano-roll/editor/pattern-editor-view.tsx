import { useRef } from "react";
import { EditorCommonLayout } from "./editor-common-layout";

export const PatternEditorView = () => {
  const measuredDivRef = useRef<HTMLDivElement>(null);
  return (
    <EditorCommonLayout
      measuredDivRef={measuredDivRef}
      sideContent={<div className="flex-c h-full bd-red">aaa</div>}
      sideContentWidth={100}
      mainContent={<div className="flex-c h-full bd-blue">bbb</div>}
    />
  );
};
