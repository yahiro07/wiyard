import { cz } from "@lib/utils/cz";
import { ReactNode } from "react";
import { ReactUnitFrame, UnitFrameScaled } from "wafer-host/react";
import { Icons } from "@/common/icons";
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
