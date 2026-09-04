import { UnitFrameScaled } from "wafer-host/react";
import { catalog, OffStageUnitItem } from "@/definitions/unit-entries";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";

const NoteChannelListColumn = ({
  noteChannelIds,
  currentNoteChannelId,
}: {
  noteChannelIds: string[];
  currentNoteChannelId: string;
}) => {
  return (
    <div className="w-50px bg-gray-600/50 flex-v gap-2 py-2">
      {noteChannelIds.map((id, index) => (
        <button
          key={id}
          type="button"
          className={cz(
            "w-40px h-30px bg-gray-300/50 flex-c text-white cursor-pointer",
            "font-bold text-sm",
            id === currentNoteChannelId && "!bg-#8ae/70",
          )}
          onClick={() => actions.setCurrentNoteChannelId(id)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

const SequencerUnitItemView = ({
  unitItem,
  displayed,
}: {
  unitItem: OffStageUnitItem;
  displayed: boolean;
}) => {
  return (
    <div
      key={unitItem.unitId}
      className={cz(
        "absolute-full",
        !displayed && "opacity-0 pointer-events-none",
      )}
    >
      <UnitFrameScaled
        unitId={unitItem.unitId}
        unitUrl={catalog[unitItem.catalogKey].loaderPageUrl}
      />
    </div>
  );
};

export const SequencerWindowContent = () => {
  const { unitItems, currentNoteChannelId } = store.useSnapshot();
  const offStageUnitItems = unitItems.filter(
    (item) => item.type === "offStage",
  );
  const noteChannelIds = offStageUnitItems.map((item) => item.noteChannelId);
  return (
    <div className="w-full h-full flex-h">
      <NoteChannelListColumn
        noteChannelIds={noteChannelIds}
        currentNoteChannelId={currentNoteChannelId}
      />
      <div className="flex-grow relative">
        {offStageUnitItems.map((item) => (
          <SequencerUnitItemView
            key={item.unitId}
            unitItem={item}
            displayed={item.noteChannelId === currentNoteChannelId}
          />
        ))}
      </div>
    </div>
  );
};
