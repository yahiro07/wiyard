import { cz } from "@lib/utils/cz";
import { Icons } from "@/common/icons";
import { NoteInputPortUnitItem, windowIds } from "@/domain/types";
import { interUnitFactories } from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { WindowFrame } from "@lib/window-system";
import { ScalerBoxDW } from "@lib/components/headless/scaler-box-d";
import { UnitWindowTitleBarPlaybackButtonContainer } from "@/views/controls/playback-buttons";
import { commonGetters } from "@/store/common-getters";
import { ReactUnitFrameWithLog } from "@lib/wafer-ex";

const NoteChannelListColumn = () => {
  const { currentNoteChannelId } = store.useSnapshot();
  const noteChannelIds = notePortGetters.useNoteChannelIds();

  const canAdd = noteChannelIds.length < 4;
  const canDelete = noteChannelIds.length > 1;

  const handleRemove = () => {
    const ok = window.confirm(
      `are you sure to remove the current note channel?`,
    );
    if (ok) {
      actions.removeCurrentNoteChannel();
    }
  };
  return (
    <div className="w-50px bg-gray-700/60 flex-v gap-2 py-2 text-white pb-3">
      {noteChannelIds.map((id, index) => {
        return (
          <div className="flex-ha gap-2" key={id}>
            <button
              type="button"
              className={cz(
                "w-40px h-30px bg-gray-300/50 flex-c text-white cursor-pointer",
                "font-bold text-sm",
                id === currentNoteChannelId && "!bg-#8ae/70",
              )}
              onClick={() => actions.selectNoteChannel(id)}
            >
              {index + 1}
            </button>
          </div>
        );
      })}
      {canAdd && (
        <button
          className="w-40px flex-c mt-1 cursor-pointer hover:opacity-80"
          type="button"
          onClick={actions.addNoteChannel}
        >
          <Icons.Add size={20} />
        </button>
      )}
      <div className="grow" />
      {canDelete && (
        <button
          className="w-40px flex-c cursor-pointer hover:opacity-80"
          type="button"
          disabled={!canDelete}
          onClick={handleRemove}
        >
          <Icons.Trash size={18} />
        </button>
      )}
    </div>
  );
};

const SequencerUnitItemView = ({
  notePortUnitItem,
}: {
  notePortUnitItem: NoteInputPortUnitItem;
}) => {
  const { currentNoteChannelId } = store.useSnapshot();
  const windowVisible = commonGetters.useWindowVisible(windowIds.pianoRoll);
  const displayed =
    windowVisible && notePortUnitItem.unitId === currentNoteChannelId;
  const internalUnitFactory =
    interUnitFactories[notePortUnitItem.sequencerClassKey];
  const sequencerUnitId = notePortGetters.getSequencerUnitId(
    notePortUnitItem.unitId,
  );
  return (
    <div className={cz("absolute-full", !displayed && "hidden")}>
      <ReactUnitFrameWithLog
        unitId={sequencerUnitId}
        unitTemplateFn={internalUnitFactory}
        viewActive={displayed}
      />
    </div>
  );
};

const PianoRollSection = () => {
  const unitItems = notePortGetters.useNoteInputPortUnitItems();
  return (
    <div className="flex-grow relative overflow-hidden">
      {unitItems.map((item) => (
        <SequencerUnitItemView key={item.unitId} notePortUnitItem={item} />
      ))}
    </div>
  );
};

const PianoRollPanel = () => {
  const windowVisible = commonGetters.useWindowVisible(windowIds.pianoRoll);
  return (
    <div className="w-full h-full flex-h">
      {windowVisible && <NoteChannelListColumn />}
      <PianoRollSection />
    </div>
  );
};

const PianoRollWindowTitleBarButtons = () => {
  const { currentNoteChannelId } = store.useSnapshot();
  const sequencerUnitId =
    notePortGetters.getSequencerUnitId(currentNoteChannelId);
  return (
    <div className="flex-ha gap-3">
      <UnitWindowTitleBarPlaybackButtonContainer unitId={sequencerUnitId} />
      {/* <windowTitleBarControlComponents.ClockActiveButton
            active={unitClockingFlags[sequencerUnitId] !== false}
            disabled={projectLoading || soloPlaybackUnitId !== null}
            onClick={() => {
              actions.toggleUnitClockingFlag(sequencerUnitId);
            }}
          /> */}
    </div>
  );
};

export const PianoRollWindow = () => {
  return (
    <WindowFrame
      id={windowIds.pianoRoll}
      title="piano roll"
      topBarInnerControls={<PianoRollWindowTitleBarButtons />}
    >
      <ScalerBoxDW designWidth={1100} scaleDirection="lower">
        <PianoRollPanel />
      </ScalerBoxDW>
    </WindowFrame>
  );
};
