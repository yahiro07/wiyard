import { Icons } from "@/common/icons";
import { decodeWireConnectionKey } from "@/domain/port-helpers";
import { unitPlaybackCapabilityFlags } from "@/domain/showcase-entries";
import { windowIds } from "@/domain/types";
import {
  CatalogItemForDisplay,
  getCatalogItemWithFallback,
} from "@/domain/unit-entries";
import { actions } from "@/store/actions";
import { notePortGetters } from "@/store/note-port-getters";
import { store, windowSystem } from "@/store/store";
import { MainPlaybackButton } from "@/views/controls/playback-buttons";
import { getSortOrder } from "@lib/utils/array-object-helper";
import { Point } from "@lib/utils/common-types";
import { cz } from "@lib/utils/cz";
import { isDefined, resultOf } from "@lib/utils/general-helper";
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
        "text-#99a cursor-pointer hover:opacity-80",
        active && "!text-#7af",
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
      destinationUnitId?: string;
      destinationUnitCatalogItem?: CatalogItemForDisplay;
    };

const helpers = {
  getFirstNoteDestinationUnitId(
    noteChannelId: string,
    wireConnectionKeys: string[],
  ): string | undefined {
    return wireConnectionKeys
      .map((key) => {
        const { sourceUnitId, destinationUnitId } =
          decodeWireConnectionKey(key);
        return sourceUnitId === noteChannelId ? destinationUnitId : undefined;
      })
      .filter(isDefined())[0];
  },
};

function usePartItems(): PartItem[] {
  const {
    unitItems,
    unitClockingFlags,
    soloModeUnitId,
    currentNoteChannelId,
    wireConnectionKeys,
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
              solo: soloModeUnitId === item.unitId,
              cardPosition: item.cardPosition,
            };
          }
        } else if (item.type === "noteInput") {
          const sequencerUnitId = notePortGetters.getSequencerUnitId(
            item.unitId,
          );
          const index = notePortGetters.getNoteInputPortIndex(item.unitId);
          const destinationUnitId = helpers.getFirstNoteDestinationUnitId(
            item.unitId,
            wireConnectionKeys,
          );
          const destinationUnitCatalogItem = resultOf(() => {
            if (destinationUnitId) {
              const unitItem = unitItems.find(
                (unit) => unit.unitId === destinationUnitId,
              );
              if (unitItem?.type === "board") {
                return getCatalogItemWithFallback(unitItem.catalogKey);
              }
            }
          });
          return {
            type: "builtinSequencer" as const,
            unitId: sequencerUnitId,
            noteChannelId: item.unitId,
            sequencerIndex: index,
            clockingActive: unitClockingFlags[sequencerUnitId],
            solo: soloModeUnitId === sequencerUnitId,
            cardPosition: item.cardPosition,
            channelActive: currentNoteChannelId === item.unitId,
            destinationUnitId,
            destinationUnitCatalogItem,
          };
        }
      })
      .filter(isDefined());
    return items.sort(getSortOrder((item) => item.cardPosition.y));
  }, [
    unitItems,
    unitClockingFlags,
    soloModeUnitId,
    currentNoteChannelId,
    wireConnectionKeys,
  ]);
}

const partItemHandlers = {
  onCardClick(partItem: PartItem) {
    if (partItem.type === "board") {
      actions.setWindowStatus(partItem.unitId, "visible");
      windowSystem.setCurrentWindow(partItem.unitId);
    } else {
      actions.setWindowStatus(windowIds.pianoRoll, "visible");
      actions.setCurrentNoteChannelId(partItem.noteChannelId);
      if (partItem.destinationUnitId) {
        actions.setWindowStatus(partItem.destinationUnitId, "visible");
        windowSystem.setCurrentWindow(partItem.destinationUnitId);
      } else {
        windowSystem.setCurrentWindow(windowIds.pianoRoll);
      }
    }
  },
};

export const PartControlBarRoot = () => {
  const partItems = usePartItems();
  return (
    <>
      <div className="absolute-left-center z-1 ml-2">
        <div
          className={cz(
            "min-h-140px pt-4 pb-6 px-1.5 bg-gray-500 flex-vc gap-4",
            "rounded-10px",
          )}
        >
          <div className="flex-c">
            <MainPlaybackButton />
          </div>
          <div className="flex-v gap-3">
            {partItems.map((item) => (
              <div key={item.unitId} className="flex-ha gap-1">
                <div
                  className={cz(
                    "w-40px h-40px flex-c bg-#ddd text-sm",
                    "rounded-8px overflow-hidden cursor-pointer",
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
                    <>
                      <div className="relative h-full">
                        {item.destinationUnitCatalogItem && (
                          <img
                            src={item.destinationUnitCatalogItem.thumbnailUrl}
                            alt={item.destinationUnitCatalogItem.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div
                          className={cz(
                            "absolute top-0 left-0 w-10px h-full flex-c text-10px",
                            "bg-#fffc text-#888",
                            item.channelActive && "!bg-#9bf text-#fff",
                          )}
                        >
                          {item.sequencerIndex + 1}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex-v gap-1">
                  <IconButton
                    icon={Icons.Power}
                    size={16}
                    active={item.clockingActive}
                    onClick={() => actions.toggleUnitClockingFlag(item.unitId)}
                  />
                  <IconButton
                    icon={Icons.Flash}
                    size={16}
                    active={item.solo}
                    onClick={() => actions.toggleSoloModeUnit(item.unitId)}
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
