import { Icons } from "@/common/icons";
import { unitPlaybackCapabilityFlags } from "@/domain/showcase-entries";
import { CatalogItem, getCatalogItem } from "@/domain/unit-entries";
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

type PartItem = {
  type: "board" | "builtinSequencer";
  catalogItem?: CatalogItem;
  label: string;
  unitId: string;
  clockingActive: boolean;
  solo: boolean;
  cardPosition: Point;
};

function usePartItems(): PartItem[] {
  const { unitItems, unitClockingFlags, soloPlaybackUnitId } =
    store.useSnapshot();
  return useMemo(() => {
    const items = unitItems
      .map((item) => {
        if (item.type === "board") {
          if (unitPlaybackCapabilityFlags[item.catalogKey]) {
            return {
              type: "board" as const,
              catalogItem: getCatalogItem(item.catalogKey),
              label: item.catalogKey.charAt(0),
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
            label: `n${index + 1}`,
            clockingActive: unitClockingFlags[sequencerUnitId],
            solo: soloPlaybackUnitId === sequencerUnitId,
            cardPosition: item.cardPosition,
          };
        }
      })
      .filter(isDefined());
    return items.sort(getSortOrder((item) => item.cardPosition.y));
  }, [unitItems, unitClockingFlags, soloPlaybackUnitId]);
}

export const PartControlBarRoot = () => {
  const partItems = usePartItems();
  return (
    <>
      <div className="absolute-left-center z-1 ml-74px">
        <div className={cz("min-h-140px py-2 px-1 bg-#ccc flex-vc gap-3")}>
          <div className="flex-c">
            <PlaybackButton />
          </div>
          <div className="flex-v gap-3">
            {partItems.map((item) => (
              <div key={item.unitId} className="flex-ha gap-1">
                <div className="w-20px h-20px flex-c bg-#ddd text-sm">
                  {item.label}
                </div>
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
                  onClick={() => actions.toggleSoloPlayback(item.unitId)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
