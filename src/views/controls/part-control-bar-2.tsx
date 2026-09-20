import { Icons } from "@/common/icons";
import { decodeWireConnectionKey } from "@/domain/port-helpers";
import { unitPlaybackCapabilityFlags } from "@/domain/showcase-entries";
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
import { isDefined, resultOf } from "@lib/utils/general-helper";
import { useMemo } from "react";
import { TapHoldButtonFrame } from "@lib/components/headless/tap-hold-button";

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
    soloPlaybackUnitId,
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
              solo: soloPlaybackUnitId === item.unitId,
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
            solo: soloPlaybackUnitId === sequencerUnitId,
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
    soloPlaybackUnitId,
    currentNoteChannelId,
    wireConnectionKeys,
  ]);
}

const partItemHandlers = {
  onCardTap(partItem: PartItem) {
    const isSoloMode = !!store.useSnapshot().soloPlaybackUnitId;
    if (isSoloMode) {
      actions.toggleSoloPlayback(partItem.unitId);
    } else {
      actions.toggleUnitClockingFlag(partItem.unitId);
    }
  },
  onCardHold(partItem: PartItem) {
    actions.toggleSoloPlayback(partItem.unitId);
  },
};

const PartItemButtonView = ({
  imageUrl,
  indexLabel,
  indexActive,
  darken,
  iconType,
}: {
  imageUrl?: string;
  indexLabel?: string;
  indexActive?: boolean;
  darken?: boolean;
  iconType?: "power" | "flash";
}) => {
  const IconComponent = iconType === "power" ? Icons.Power : Icons.Flash;
  return (
    <div
      className={cz(
        "w-48px h-32px flex-c bg-#ddd text-sm relative",
        "rounded-1px overflow-hidden cursor-pointer",
      )}
      style={{
        boxShadow: "0 0 0.5px 0.5px #0008",
      }}
    >
      {imageUrl && (
        <img className="w-full h-full object-cover" src={imageUrl} />
      )}
      {indexLabel && (
        <div
          className={cz(
            "absolute top-0 left-0 w-10px h-full flex-c text-10px",
            "bg-#fffc text-#888",
            indexActive && "!bg-#9bf text-#fff",
          )}
        >
          {indexLabel}
        </div>
      )}
      {darken && <div className="absolute-full bg-#0006" />}
      {iconType && (
        <div className={cz("absolute-full flex-c", "bg-#0004")}>
          <IconComponent
            className="text-16px text-#fff"
            style={{ filter: "drop-shadow(0px 0px 1px #0004)" }}
          />
        </div>
      )}
    </div>
  );
};

const PartItemButton = ({ item }: { item: PartItem }) => {
  const isSoloMode = !!store.useSnapshot().soloPlaybackUnitId;
  return (
    <TapHoldButtonFrame
      onTap={() => partItemHandlers.onCardTap(item)}
      onHold={() => partItemHandlers.onCardHold(item)}
    >
      {!isSoloMode && (
        <>
          {item.type === "board" ? (
            <PartItemButtonView
              imageUrl={item.catalogItem.thumbnailUrl}
              darken={!item.clockingActive}
              iconType={item.clockingActive ? "power" : undefined}
            />
          ) : (
            <PartItemButtonView
              imageUrl={item.destinationUnitCatalogItem?.thumbnailUrl}
              indexLabel={(item.sequencerIndex + 1).toString()}
              indexActive={item.channelActive}
              darken={!item.clockingActive}
              iconType={item.clockingActive ? "power" : undefined}
            />
          )}
        </>
      )}
      {isSoloMode && (
        <>
          {item.type === "board" ? (
            <PartItemButtonView
              imageUrl={item.catalogItem.thumbnailUrl}
              darken={!item.solo}
              iconType={item.solo ? "flash" : undefined}
            />
          ) : (
            <PartItemButtonView
              imageUrl={item.destinationUnitCatalogItem?.thumbnailUrl}
              indexLabel={(item.sequencerIndex + 1).toString()}
              indexActive={item.channelActive}
              darken={!item.solo}
              iconType={item.solo ? "flash" : undefined}
            />
          )}
        </>
      )}
    </TapHoldButtonFrame>
  );
};

export const PartControlBarRoot2 = () => {
  const partItems = usePartItems();
  return (
    <>
      <div className="absolute-left-center z-1 ml-2">
        <div
          className={cz("min-h-140px py-3 px-1.5 bg-gray-500 flex-vc gap-3")}
        >
          <div className="flex-c">
            <PlaybackButton />
          </div>
          <div className="flex-v gap-3">
            {partItems.map((item) => (
              <PartItemButton key={item.unitId} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
