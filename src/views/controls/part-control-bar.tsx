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
import { ButtonFrame } from "@lib/components/headless/button-frame";
import { TapHoldButtonFrame } from "@lib/components/headless/tap-hold-button";

const IconButton = ({
  active,
  disabled,
  icon: IConComponent,
  size,
  onTap,
  onHold,
}: {
  active?: boolean;
  disabled?: boolean;
  icon: IconType;
  size: number;
  onTap: () => void;
  onHold: () => void;
}) => {
  return (
    <TapHoldButtonFrame onTap={onTap} onHold={onHold} disabled={disabled}>
      <div
        className={cz(
          "text-#99a cursor-pointer hover:opacity-80",
          active && "!text-#fff",
          disabled && "!opacity-30",
          disabled && "pointer-events-none",
        )}
      >
        <IConComponent size={size} />
      </div>
    </TapHoldButtonFrame>
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
              clockingActive: !(unitClockingFlags[item.unitId] === false),
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
            clockingActive: !(unitClockingFlags[sequencerUnitId] === false),
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
      windowSystem.setCurrentWindow(windowIds.pianoRoll);
    }
  },
  onIconTap(partItem: PartItem) {
    const isSoloMode = !!store.state.soloModeUnitId;
    if (isSoloMode) {
      actions.toggleSoloModeUnit(partItem.unitId);
    } else {
      actions.toggleUnitClockingFlag(partItem.unitId);
    }
  },
  onIconHold(partItem: PartItem) {
    actions.toggleSoloModeUnit(partItem.unitId);
  },
};

const PartItemButtonView = ({
  imageUrl,
  indexLabel,
  indexActive,
}: {
  imageUrl?: string;
  indexLabel?: string;
  indexActive?: boolean;
}) => {
  return (
    <div
      className={cz(
        "w-36px h-36px flex-c bg-#ddd text-sm",
        "rounded-4px overflow-hidden cursor-pointer relative",
      )}
      // style={{ boxShadow: "0 0 0.7px 0.7px #0004" }}
    >
      {imageUrl && (
        <img src={imageUrl} className="w-full h-full object-cover" />
      )}
      {indexLabel && (
        <div className="absolute top-0 left-0 h-full">
          <div
            className={cz(
              "w-12px h-full flex-c text-10px font-500",
              "bg-#aaa",
              indexActive && "!bg-#9bf text-#fff",
            )}
          >
            {indexLabel}
          </div>
        </div>
      )}
    </div>
  );
};

const PartItemControlRow = ({ item }: { item: PartItem }) => {
  const isSoloMode = !!store.useSnapshot().soloModeUnitId;
  return (
    <div className="flex-ha gap-2">
      <ButtonFrame onClick={() => partItemHandlers.onCardClick(item)}>
        {item.type === "board" ? (
          <PartItemButtonView imageUrl={item.catalogItem.thumbnailUrl} />
        ) : (
          <PartItemButtonView
            imageUrl={item.destinationUnitCatalogItem?.thumbnailUrl}
            indexLabel={(item.sequencerIndex + 1).toString()}
            indexActive={item.channelActive}
          />
        )}
      </ButtonFrame>
      {isSoloMode ? (
        <IconButton
          icon={Icons.Flash}
          size={16}
          active={item.solo}
          onTap={() => partItemHandlers.onIconTap(item)}
          onHold={() => partItemHandlers.onIconHold(item)}
        />
      ) : (
        <IconButton
          icon={Icons.Power}
          size={16}
          active={item.clockingActive}
          onTap={() => partItemHandlers.onIconTap(item)}
          onHold={() => partItemHandlers.onIconHold(item)}
        />
      )}
    </div>
  );
};

export const PartControlBarRoot = () => {
  const partItems = usePartItems();
  if (partItems.length === 0) return;
  return (
    <>
      <div className="absolute-left-center z-1 ml-2">
        <div
          className={cz(
            "min-h-140px pt-4 pb-6 px-1.5 bg-#888890 flex-vc gap-4",
            "rounded-5px",
          )}
        >
          <div className="flex-c">
            <MainPlaybackButton />
          </div>
          <div className="flex-v gap-3">
            {partItems.map((item) => (
              <PartItemControlRow key={item.unitId} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
