import { uiColorsCssVarsStyle } from "../common/ui-theme";
import { Button } from "../components/button";
import { EffectorBody } from "../components/effector-body";
import { IconButton } from "../components/icon-button";
import { Icons } from "../components/icons";
import { Knob } from "../components/knob";
import { LabeledBox } from "../components/labeled-box";
import { ShiftSelector } from "../components/shift-selector";
import { LoopBarLength } from "../definitions/model";
import { PianoRollEditorView } from "../editor/piano-roll-editor-view";
import { createSelectorOptions } from "../utils/selector-option";
import { store } from "./store";

const DutyKnobContainer = () => {
  const st = store.useSnapshot();
  return (
    <LabeledBox label="duty">
      <Knob value={st.duty} onChange={store.setDuty} />
    </LabeledBox>
  );
};

const OctaveKnobContainer = () => {
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

export const loopBarsOptions = createSelectorOptions<LoopBarLength>(
  ([0.25, 0.5, 1, 2, 4, 8, 16] satisfies LoopBarLength[]).map((v) => [
    v,
    `${v < 1 ? `1/${1 / v}` : v}`,
  ]),
);

const LoopBarsSelectorContainer = () => {
  const st = store.useSnapshot();
  return (
    <LabeledBox label="loop bars">
      <ShiftSelector
        minWidth={50}
        value={st.loopBars}
        options={loopBarsOptions}
        onChange={store.setLoopBars}
      />
    </LabeledBox>
  );
};

const PianoRollEditorViewContainer = () => {
  return <PianoRollEditorView />;
};

const PagerContainer = () => {
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
  const hasNote = store.useSnapshot().notes.length > 0;
  return (
    <IconButton disabled={!hasNote} onClick={() => store.setNotes([])}>
      <Icons.Trash size={20} />
    </IconButton>
  );
};

const TopBar = () => {
  return (
    <div className="w-full flex-v gap-4">
      <div className="flex-ha justify-between">
        <div className="font-bold text-24px">Fluorite Piano Roll</div>
        <div className="flex-ha gap-7">
          <div className="flex-ha gap-6">
            <TrashButtonContainer />
            <OctaveKnobContainer />
            <DutyKnobContainer />
            <LoopBarsSelectorContainer />
          </div>
          <PagerContainer />
        </div>
      </div>
    </div>
  );
};

export const PageRoot = () => {
  return (
    <div style={uiColorsCssVarsStyle}>
      <EffectorBody className="w-800px h-450px flex-c">
        <div className="flex-v gap-2">
          <TopBar />
          <PianoRollEditorViewContainer />
        </div>
      </EffectorBody>
    </div>
  );
};
