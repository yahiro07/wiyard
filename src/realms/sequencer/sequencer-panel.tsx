import { UnitFrameScaled } from "wafer-host/react";
import { OffStageUnitItem } from "@/domain/types";
import { catalog } from "@/domain/unit-entries";
import {
  useNoteChannelListColumnPresenter,
  useOffStageUnitItems,
} from "@/realms/sequencer/sequencer-panel-models";
import { store } from "@/store/store";
import { cz } from "@/utils/cz";

const NoteChannelListColumn = () => {
  const { noteChannelIds, currentNoteChannelId, selectNoteChannel } =
    useNoteChannelListColumnPresenter();
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
          onClick={() => selectNoteChannel(id)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

const SequencerUnitItemView = ({
  unitItem,
}: {
  unitItem: OffStageUnitItem;
}) => {
  const { currentNoteChannelId } = store.useSnapshot();
  const displayed = unitItem.noteChannelId === currentNoteChannelId;
  return (
    <div
      key={unitItem.unitId}
      className={cz("absolute-full", !displayed && "invisible")}
    >
      <UnitFrameScaled
        unitId={unitItem.unitId}
        unitUrl={catalog[unitItem.catalogKey].loaderPageUrl}
      />
    </div>
  );
};

const SequencerSection = () => {
  const offStageUnitItems = useOffStageUnitItems();
  return (
    <div className="flex-grow relative">
      {offStageUnitItems.map((item) => (
        <SequencerUnitItemView key={item.unitId} unitItem={item} />
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
