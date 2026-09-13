import { ReactNode } from "react";
import { ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import { NoteInputPortUnitItem } from "@/domain/types";
import {
  CatalogKey,
  catalog,
  InternalUnitKey,
  internalUnitSpecs,
} from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";

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
    <div className="w-50px bg-gray-600/60 flex-v gap-2 py-2">
      {noteChannelIds.map((id, index) => (
        <button
          key={id}
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
      ))}
      {canAdd && (
        <button type="button" onClick={actions.addNoteChannel}>
          add
        </button>
      )}
      <div className="grow" />
      {canDelete && (
        <button type="button" disabled={!canDelete} onClick={handleRemove}>
          remove
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
  const displayed = notePortUnitItem.unitId === currentNoteChannelId;
  const internalUnitSpec =
    internalUnitSpecs[notePortUnitItem.sequencerClassKey as InternalUnitKey];
  const catalogItem = catalog[notePortUnitItem.sequencerClassKey as CatalogKey];
  const sequencerUnitId = notePortGetters.getSequencerUnitId(
    notePortUnitItem.unitId,
  );
  let content: ReactNode;
  if (internalUnitSpec) {
    content = (
      <ReactUnitFrame
        unitId={sequencerUnitId}
        unitTemplateFn={internalUnitSpec.factory}
      />
    );
  } else if (catalogItem) {
    content = (
      <UnitFrameScaled
        unitId={sequencerUnitId}
        unitUrl={catalogItem.loaderPageUrl}
      />
    );
  }
  return (
    <div className={cz("absolute-full", !displayed && "invisible")}>
      {content}
    </div>
  );
};

const SequencerSection = () => {
  const unitItems = notePortGetters.useNoteInputPortUnitItems();
  return (
    <div className="flex-grow relative">
      {unitItems.map((item) => (
        <SequencerUnitItemView key={item.unitId} notePortUnitItem={item} />
      ))}
    </div>
  );
};

export const SequencerPanel = () => {
  return (
    <div className="w-full h-full flex-h">
      <NoteChannelListColumn />
      <SequencerSection />
    </div>
  );
};
