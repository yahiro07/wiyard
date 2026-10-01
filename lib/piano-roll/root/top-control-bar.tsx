import { KeyName, MessageFromUnit } from "@lib/contract";
import {
  createPlainSelectorOptions,
  createSelectorOptions,
} from "@lib/utils/selector-option";
import {
  allKeyNames,
  mapSongKeySpecFromKeyName,
  mapSongKeySpecToKeyName,
} from "@lib/utils/song-key-helper";
import { Button } from "../components/button";
import { IconButton } from "../components/icon-button";
import { Icons } from "../components/icons";
import { Knob } from "../components/knob";
import { LabeledBox } from "../components/labeled-box";
import { Selector } from "../components/selector";
import { ShiftSelector } from "../components/shift-selector";
import { LoopBarLength, PatternBarLength, Sight } from "../definitions/types";
import { useAppContext, useStoreAccess } from "./app-context";
import { useControlActions } from "./control-actions";
import { getNotesTailPositionInBars } from "../editor/common/editor-common-logic";
import { appConfig } from "../definitions/ui-config";

const keyNameOptions = createPlainSelectorOptions<KeyName>(allKeyNames);

const SongKeySelector = () => {
  const { store, unitInterface } = useAppContext();
  const { keySpec } = store.useSnapshot();
  const currentKeyName = mapSongKeySpecToKeyName(keySpec);

  const handleChange = (keyName: KeyName) => {
    if (appConfig.isOnUnitsDevPage) {
      const newKeySpec = mapSongKeySpecFromKeyName(keyName);
      store.setKeySpec(newKeySpec);
    }

    const message: MessageFromUnit = {
      type: "setKeyName",
      keyName,
    };
    unitInterface.sendMessageToHost(message);
  };

  return (
    <LabeledBox label="key">
      <Selector
        value={currentKeyName}
        options={keyNameOptions}
        onChange={handleChange}
      />
    </LabeledBox>
  );
};

const DutyKnobContainer = () => {
  const [{ noteDuty }, mt] = useStoreAccess();
  return (
    <LabeledBox label="duty">
      <Knob value={noteDuty} onChange={mt.setNoteDuty} />
    </LabeledBox>
  );
};

const OctaveKnobContainer = () => {
  const [{ octaveShift }, mt] = useStoreAccess();
  return (
    <LabeledBox label="octave">
      <Knob
        value={octaveShift}
        min={-2}
        max={2}
        step={1}
        onChange={mt.setOctaveShift}
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

const patternBarsOptions = createSelectorOptions<PatternBarLength>(
  ([0.25, 0.5, 1, 2] satisfies LoopBarLength[]).map((v) => [
    v,
    `${v < 1 ? `1/${1 / v}` : v}`,
  ]),
);

const LoopBarsSelectorContainer = () => {
  const [{ loopBars }, mt] = useStoreAccess();
  return (
    <LabeledBox label="loop bars">
      <ShiftSelector
        minWidth={50}
        value={loopBars}
        options={loopBarsOptions}
        onChange={mt.setLoopBars}
      />
    </LabeledBox>
  );
};

const _LoopBarsSelectorContainerEx = () => {
  const { store } = useAppContext();
  const { loopBars, patternBars, isPatternView } = store.useSnapshot();
  const [options, value, onChange] = isPatternView
    ? [patternBarsOptions, patternBars, store.setPatternBars]
    : [loopBarsOptions, loopBars, store.setLoopBars];
  return (
    <LabeledBox label={isPatternView ? "pt bars" : "loop bars"}>
      <ShiftSelector
        minWidth={50}
        value={value}
        options={options}
        onChange={onChange as (value: LoopBarLength | PatternBarLength) => void}
      />
    </LabeledBox>
  );
};

const TrashIconButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) => {
  return (
    <IconButton disabled={disabled} onClick={onClick}>
      <Icons.Trash size={20} />
    </IconButton>
  );
};

const TrashButtonContainer = () => {
  const { store } = useAppContext();
  const controlActions = useControlActions();
  const { inputNotes, patternNotes, isPatternView } = store.useSnapshot();
  if (!isPatternView) {
    return (
      <TrashIconButton
        disabled={inputNotes.length === 0}
        onClick={controlActions.clearEditData}
      />
    );
  } else {
    return (
      <TrashIconButton
        disabled={patternNotes.length === 0}
        onClick={controlActions.clearPatternNotes}
      />
    );
  }
};

const SightControlKnobs = () => {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const patchSight = (attrs: Partial<Sight>) => {
    store.setSight({ ...sight, ...attrs });
  };
  return (
    <div className="flex-ha gap-2">
      {/* <LabeledBox label="xzoom">
        <Knob value={sight.xZoom} onChange={(v) => patchSight({ xZoom: v })} />
      </LabeledBox> */}
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
  const [{ patternEnabled, patternNotes, realized, isPatternView }, mt] =
    useStoreAccess();
  const hasPatternNotes = patternNotes.length > 0;
  return (
    <IconButton
      active={patternEnabled}
      disabled={realized || !hasPatternNotes || isPatternView}
      onClick={mt.togglePatternEnabled}
    >
      <div className="w-28px h-28px relative">
        <Icons.Fish size={13} className="absolute top-0 left-0 m-2px" />
        <Icons.Fish size={13} className="absolute bottom-0 right-0 m-2px" />
      </div>
    </IconButton>
  );
};

const DiatonicLanesToggleButton = () => {
  const [{ diatonicLanesEnabled }, mt] = useStoreAccess();
  return (
    <Button
      active={diatonicLanesEnabled}
      onClick={mt.toggleDiatonicLanesEnabled}
      text="diatonic"
    />
  );
};

const LoopGhostToggleButton = () => {
  const [{ loopGhostEnabled, isPatternView }, mt] = useStoreAccess();
  return (
    <Button
      active={loopGhostEnabled}
      disabled={isPatternView}
      onClick={mt.toggleLoopGhostEnabled}
      text="ghost"
    />
  );
};

const DiatonicLanesAllowSemitoneInputToggleButton = () => {
  const [{ diatonicLanesAllowSemitoneInput }, mt] = useStoreAccess();
  return (
    <Button
      active={diatonicLanesAllowSemitoneInput}
      onClick={mt.toggleDiatonicLanesAllowSemitoneInput}
      text="semi"
    />
  );
};

const RealizeButton = () => {
  const [
    { realized, patternEnabled, inputNotes, patternNotes, isPatternView },
  ] = useStoreAccess();
  const controlActions = useControlActions();
  const canRealize =
    patternEnabled &&
    inputNotes.length > 0 &&
    patternNotes.length > 0 &&
    !isPatternView;
  return (
    <div className="-ml-1">
      {realized ? (
        <IconButton
          disabled={isPatternView}
          onClick={controlActions.undoRealize}
        >
          <Icons.Restore size={20} />
        </IconButton>
      ) : (
        <IconButton
          disabled={!canRealize}
          onClick={controlActions.realizeNotes}
        >
          <Icons.Check size={20} />
        </IconButton>
      )}
    </div>
  );
};

const DuplicateNotes2XButton = () => {
  const [{ inputNotes, loopBars, patternNotes, isPatternView }] =
    useStoreAccess();
  const controlActions = useControlActions();
  const text = "copy 2x";
  if (!isPatternView) {
    const tailBars = getNotesTailPositionInBars(inputNotes);
    const enabled = (0 < tailBars && tailBars <= 8) || loopBars <= 8;
    return (
      <Button
        disabled={!enabled}
        onClick={controlActions.duplicateInputNotes2X}
        text={text}
      />
    );
  } else {
    const tailBars = getNotesTailPositionInBars(patternNotes);
    const enabled = 0 < tailBars && tailBars <= 1;
    return (
      <Button
        disabled={!enabled}
        onClick={controlActions.duplicatePatternNotes2X}
        text={text}
      />
    );
  }
};

export const TopControlBar = () => {
  return (
    <div className="w-full flex-v gap-4">
      <div className="flex-ha justify-between">
        <div className="font-bold text-24px">Piano Roll</div>
        <div className="flex-ha gap-7">
          <div className="flex-ha gap-6">
            <SongKeySelector />

            <div className="flex-ha gap-2">
              <DiatonicLanesToggleButton />
              <DiatonicLanesAllowSemitoneInputToggleButton />
            </div>

            <div className="flex-ha">
              <ViewModeSelector />
              <PatternToggleButton />
              <RealizeButton />
            </div>
            <LoopGhostToggleButton />
            <DuplicateNotes2XButton />

            <TrashButtonContainer />
            <OctaveKnobContainer />
            <DutyKnobContainer />
            <LoopBarsSelectorContainer />
          </div>
          {/* <PagerContainer /> */}
          <SightControlKnobs />
        </div>
      </div>
    </div>
  );
};
