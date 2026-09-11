import { Button } from "../components/button";
import { EffectorBody } from "../components/effector-body";
import { IconButton } from "../components/icon-button";
import { Icons } from "../components/icons";
import { Knob } from "../components/knob";
import { LabeledBox } from "../components/labeled-box";
import { ShiftSelector } from "../components/shift-selector";
import {
  LoopBarLength,
  PatternLoopBarLength,
  Sight,
} from "../definitions/types";
import { uiColorsCssVarsStyle } from "../definitions/ui-theme";
import { PatternEditorView } from "../editor/pattern-editor-view";
import { PianoRollEditorView } from "../editor/piano-roll-editor-view";
import { createSelectorOptions } from "../utils/selector-option";
import { useAppContext, useStoreAccess } from "./app-context";

const DutyKnobContainer = () => {
  const { store } = useAppContext();
  const st = store.useSnapshot();
  return (
    <LabeledBox label="duty">
      <Knob value={st.duty} onChange={store.setDuty} />
    </LabeledBox>
  );
};

const OctaveKnobContainer = () => {
  const { store } = useAppContext();
  const st = store.useSnapshot();
  return (
    <LabeledBox label="octave">
      <Knob
        value={st.octave}
        min={-2}
        max={2}
        step={1}
        onChange={store.setOctave}
      />
    </LabeledBox>
  );
};

const loopBarsOptions = createSelectorOptions<LoopBarLength>(
  ([0.25, 0.5, 1, 2, 4, 8, 16] satisfies LoopBarLength[]).map((v) => [
    v,
    `${v < 1 ? `1/${1 / v}` : v}`,
  ]),
);

const patternLoopBarsOptions = createSelectorOptions<PatternLoopBarLength>(
  ([0.25, 0.5, 1, 2] satisfies LoopBarLength[]).map((v) => [
    v,
    `${v < 1 ? `1/${1 / v}` : v}`,
  ]),
);

const LoopBarsSelectorContainer = () => {
  const { store } = useAppContext();
  const { loopBars, patternLoopBars, isPatternView } = store.useSnapshot();
  const [options, value, onChange] = isPatternView
    ? [patternLoopBarsOptions, patternLoopBars, store.setPatternLoopBars]
    : [loopBarsOptions, loopBars, store.setLoopBars];
  return (
    <LabeledBox label="loop bars">
      <ShiftSelector
        minWidth={50}
        value={value}
        options={options}
        onChange={
          onChange as (value: LoopBarLength | PatternLoopBarLength) => void
        }
      />
    </LabeledBox>
  );
};

const PagerContainer = () => {
  const { store } = useAppContext();
  const st = store.useSnapshot();
  const totalPages = Math.max(1, st.loopBars / 2);
  const canShiftLeft = st.pageIndex > 0;
  const canShiftRight = st.pageIndex < totalPages - 1;

  const shiftPage = (dir: -1 | 1) => {
    store.setPageIndex(st.pageIndex + dir);
  };
  return (
    <LabeledBox label="">
      <div className="flex-ha gap-2">
        <Button disabled={!canShiftLeft} onClick={() => shiftPage(-1)}>
          <Icons.CaretLeft size={20} />
        </Button>
        <div className="w-50px flex-c">
          {st.pageIndex + 1} / {totalPages}
        </div>
        <Button disabled={!canShiftRight} onClick={() => shiftPage(1)}>
          <Icons.CaretRight size={20} />
        </Button>
      </div>
    </LabeledBox>
  );
};

const TrashButtonContainer = () => {
  const { store } = useAppContext();
  const hasNote = store.useSnapshot().notes.length > 0;
  return (
    <IconButton disabled={!hasNote} onClick={() => store.setNotes([])}>
      <Icons.Trash size={20} />
    </IconButton>
  );
};

const SightControlKnobs = () => {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const patchSight = (attrs: Partial<Sight>) => {
    store.setSight({ ...sight, ...attrs });
  };
  return (
    <div className="flex-ha gap-2">
      <LabeledBox label="xzoom">
        <Knob value={sight.xZoom} onChange={(v) => patchSight({ xZoom: v })} />
      </LabeledBox>
      <LabeledBox label="yzoom">
        <Knob value={sight.yZoom} onChange={(v) => patchSight({ yZoom: v })} />
      </LabeledBox>
    </div>
  );
};

const ViewModeSelector = () => {
  const { store } = useAppContext();
  const { isPatternView } = store.useSnapshot();
  return (
    <Button
      active={isPatternView}
      onClick={store.toggleIsPatternView}
      text="pattern"
    />
  );
};

const PatternToggleButton = () => {
  const [{ patternEnabled, patternNotes }, mt] = useStoreAccess();
  const hasPatternNotes = patternNotes.length > 0;
  return (
    <IconButton
      active={patternEnabled}
      disabled={!hasPatternNotes}
      onClick={mt.togglePatternEnabled}
      className="!p-1px "
    >
      <div className="w-28px h-28px relative">
        <Icons.Fish size={13} className="absolute top-0 left-0 m-2px" />
        <Icons.Fish size={13} className="absolute bottom-0 right-0 m-2px" />
      </div>
    </IconButton>
  );
};

const TopBar = () => {
  return (
    <div className="w-full flex-v gap-4">
      <div className="flex-ha justify-between">
        <div className="font-bold text-24px">Piano Roll</div>
        <div className="flex-ha gap-7">
          <div className="flex-ha gap-6">
            <div className="flex-ha gap-2">
              <ViewModeSelector />
              <PatternToggleButton />
            </div>
            <TrashButtonContainer />
            <OctaveKnobContainer />
            <DutyKnobContainer />
            <LoopBarsSelectorContainer />
          </div>
          <PagerContainer />
          <SightControlKnobs />
        </div>
      </div>
    </div>
  );
};

export const PageRoot = () => {
  const { isPatternView } = useAppContext().store.useSnapshot();
  return (
    <div className="w-full h-full" style={uiColorsCssVarsStyle}>
      <EffectorBody className="w-full h-full flex-vc gap-2">
        <TopBar />
        {isPatternView ? <PatternEditorView /> : <PianoRollEditorView />}
      </EffectorBody>
    </div>
  );
};
