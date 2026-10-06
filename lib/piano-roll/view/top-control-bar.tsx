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
import { LoopBarLength, PatternMode, Sight } from "../definitions/types";
import { useAppContext, useStoreAccess } from "../model/app-context";
import { useControlActions } from "../model/control-actions";
import { getNotesTailPositionInBars } from "../editor/common/editor-common-logic";
import { appConfig, uiConfig } from "../definitions/ui-config";
import { XYZoomPad } from "../components/xy-zoom-pad";
import { linearInterpolate } from "@lib/utils/number-helper";

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
  const { loopBars } = store.useSnapshot();
  return (
    <LabeledBox label="loop bars">
      <ShiftSelector
        minWidth={50}
        value={loopBars}
        options={loopBarsOptions}
        onChange={store.setLoopBars}
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

const DisplayWidthSelectionKnob = () => {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const patchSight = (attrs: Partial<Sight>) => {
    store.setSight({ ...sight, ...attrs });
  };
  const value = Math.log2(sight.wBars);
  const onChange = (v: number) => {
    patchSight({ wBars: 2 ** v });
  };
  return <Knob value={value} onChange={onChange} min={1} step={0.01} max={4} />;
};

const XYZoomPadContainer = () => {
  const { store } = useAppContext();
  const { sight } = store.useSnapshot();
  const patchSight = (attrs: Partial<Sight>) => {
    store.setSight({ ...sight, ...attrs });
  };
  const wBarOptions = uiConfig.displayBarOptions;
  const wBarsIndex = wBarOptions.indexOf(sight.wBars);
  const onXYChange = (x: number, y: number) => {
    const wBars = wBarOptions[x];
    const yZoom = y;
    patchSight({ wBars, yZoom });
  };
  const xTickRate = [0.25, 0.5, 0.75, 1][wBarsIndex];
  const yTickRate = linearInterpolate(sight.yZoom, 0, 1, 0.25, 1);
  return (
    <XYZoomPad
      xValue={wBarsIndex}
      xMin={0}
      xMax={3}
      xStep={1}
      yValue={sight.yZoom}
      yMin={0}
      yMax={1}
      yStep={0.1}
      onXYChange={onXYChange}
      xTickRate={xTickRate}
      yTickRate={yTickRate}
    />
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
      <LabeledBox label="bars">
        <DisplayWidthSelectionKnob />
      </LabeledBox>
      <LabeledBox label="yzoom">
        <Knob
          value={sight.yZoom}
          onChange={(v) => patchSight({ yZoom: v })}
          min={0}
          max={1}
          step={0.05}
        />
      </LabeledBox>
    </div>
  );
};

const SightControlXYPad = () => {
  return (
    <LabeledBox>
      <XYZoomPadContainer />
    </LabeledBox>
  );
};

const ViewModeSelector = () => {
  const [{ isPatternView }, mt] = useStoreAccess();
  return (
    <Button
      active={isPatternView}
      onClick={mt.toggleIsPatternView}
      text="pattern"
    />
  );
};

const patternModeOptions = createPlainSelectorOptions<PatternMode>([1, 2]);

const PatternModeSelector = () => {
  const [{ patternMode }, mt] = useStoreAccess();
  return (
    <Selector
      className="w-30px"
      value={patternMode}
      options={patternModeOptions}
      onChange={mt.setPatternMode}
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
    <div className="w-full flex-v gap-4 pb-2px">
      <div className="flex-ha justify-between">
        <div className="font-bold text-24px">Piano Roll</div>
        <div className="flex-ha gap-8">
          <div className="flex-ha gap-6">
            <SongKeySelector />
            <LabeledBox>
              <div className="flex-ha gap-2">
                <DiatonicLanesToggleButton />
                <DiatonicLanesAllowSemitoneInputToggleButton />
              </div>
            </LabeledBox>
            <LabeledBox>
              <div className="flex-ha">
                <div className="flex-ha gap-2px">
                  <ViewModeSelector />
                  <PatternModeSelector />
                </div>
                <PatternToggleButton />
                <RealizeButton />
              </div>
            </LabeledBox>
            <LabeledBox>
              <div className="flex-ha gap-3">
                <LoopGhostToggleButton />
                <DuplicateNotes2XButton />
                <TrashButtonContainer />
              </div>
            </LabeledBox>
            <OctaveKnobContainer />
            <DutyKnobContainer />
            <LoopBarsSelectorContainer />
          </div>
          {/* <PagerContainer /> */}
          {0 ? <SightControlXYPad /> : <SightControlKnobs />}
        </div>
      </div>
    </div>
  );
};
