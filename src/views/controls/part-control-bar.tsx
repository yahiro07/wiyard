import { Icons } from "@/common/icons";
import { unitPlaybackCapabilityFlags } from "@/domain/showcase-entries";
import { windowIds } from "@/domain/types";
import {
  CatalogItemForDisplay,
  getCatalogItemWithFallback,
} from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { notePortGetters } from "@/store/note-port-getters";
import { store } from "@/store/store";
import { PlaybackButton } from "@/views/controls/control-buttons";
import { getSortOrder } from "@lib/utils/array-object-helper";
import { Point } from "@lib/utils/common-types";
import { cz } from "@lib/utils/cz";
import { isDefined } from "@lib/utils/general-helper";
import { useMemo } from "react";
import { IconType } from "react-icons";

const IconButton = ({
  active,
  disabled,
  icon: IConComponent,
  size,
  onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  icon: IconType;
  size: number;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={cz(
        "text-#aaa cursor-pointer hover:opacity-80",
        active && "!text-#8af",
        disabled && "!opacity-30",
        disabled && "pointer-events-none",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <IConComponent size={size} />
    </button>
  );
};

type PartItem =
  | {
      type: "board";
      catalogItem: CatalogItemForDisplay;
      unitId: string;
      clockingActive: boolean;
      solo: boolean;
      cardPosition: Point;
    }
  | {
      type: "builtinSequencer";
      unitId: string;
      noteChannelId: string;
      sequencerIndex: number;
      clockingActive: boolean;
      solo: boolean;
      cardPosition: Point;
      channelActive: boolean;
    };

function usePartItems(): PartItem[] {
  const {
    unitItems,
    unitClockingFlags,
    soloPlaybackUnitId,
    currentNoteChannelId,
  } = store.useSnapshot();
  return useMemo(() => {
    const items = unitItems
      .map((item) => {
        if (item.type === "board") {
          if (unitPlaybackCapabilityFlags[item.catalogKey]) {
            return {
              type: "board" as const,
              catalogItem: getCatalogItemWithFallback(item.catalogKey),
              unitId: item.unitId,
              clockingActive: unitClockingFlags[item.unitId],
              solo: soloPlaybackUnitId === item.unitId,
              cardPosition: item.cardPosition,
            };
          }
        } else if (item.type === "noteInput") {
          const sequencerUnitId = notePortGetters.getSequencerUnitId(
            item.unitId,
          );
          const index = notePortGetters.getNoteInputPortIndex(item.unitId);
          return {
            type: "builtinSequencer" as const,
            unitId: sequencerUnitId,
            noteChannelId: item.unitId,
            sequencerIndex: index,
            clockingActive: unitClockingFlags[sequencerUnitId],
            solo: soloPlaybackUnitId === sequencerUnitId,
            cardPosition: item.cardPosition,
            channelActive: currentNoteChannelId === item.unitId,
          };
        }
      })
      .filter(isDefined());
    return items.sort(getSortOrder((item) => item.cardPosition.y));
  }, [unitItems, unitClockingFlags, soloPlaybackUnitId, currentNoteChannelId]);
}

const partItemHandlers = {
  onCardClick(partItem: PartItem) {
    if (partItem.type === "board") {
      actions.setWindowStatus(partItem.unitId, "visible");
    } else {
      actions.setWindowStatus(windowIds.pianoRoll, "visible");
      actions.setCurrentNoteChannelId(partItem.noteChannelId);
    }
  },
};

export const PartControlBarRoot = () => {
  const partItems = usePartItems();
  return (
    <>
      <div className="absolute-left-center z-1 ml-2">
        <div className={cz("min-h-140px py-3 px-1.5 bg-#ccc flex-vc gap-3")}>
          <div className="flex-c">
            <PlaybackButton />
          </div>
          <div className="flex-v gap-3">
            {partItems.map((item) => (
              <div key={item.unitId} className="flex-ha gap-1">
                <div
                  className={cz(
                    "w-40px h-40px flex-c bg-#ddd text-sm",
                    "rounded-8px overflow-hidden",
                  )}
                  onClick={() => partItemHandlers.onCardClick(item)}
                >
                  {item.type === "board" ? (
                    <img
                      src={item.catalogItem.thumbnailUrl}
                      alt={item.catalogItem.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={cz(
                        item.channelActive &&
                          "w-full h-full border-l-#8af border-l-4px flex-c border-r-4px border-r-#0000",
                      )}
                    >
                      {item.sequencerIndex + 1}
                    </div>
                  )}
                </div>
                <div className="flex-v gap-1">
                  <IconButton
                    icon={Icons.Power}
                    size={17}
                    active={item.clockingActive}
                    onClick={() => actions.toggleUnitClockingFlag(item.unitId)}
                  />
                  <IconButton
                    icon={Icons.Flash}
                    size={17}
                    active={item.solo}
                    onClick={() => actions.toggleSoloPlayback(item.unitId)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
