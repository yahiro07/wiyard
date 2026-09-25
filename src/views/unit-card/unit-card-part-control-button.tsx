import { Icons } from "@/common/icons";
import { actions } from "@/store/actions";
import { store } from "@/store/store";
import { TapHoldButtonFrame } from "@lib/components/headless/tap-hold-button";
import { cz } from "@lib/utils/cz";

const PartControlIconButtonView = ({
  active,
  disabled,
  children,
  onTap,
  onHold,
}: {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onTap: () => void;
  onHold: () => void;
}) => {
  return (
    <TapHoldButtonFrame onTap={onTap} onHold={onHold} disabled={disabled}>
      <div
        className={cz(
          "text-#fff text-20px cursor-pointer hover:opacity-80 p-1",
          !active && "!opacity-20",
        )}
      >
        {children}
      </div>
    </TapHoldButtonFrame>
  );
};

export const UnitCardPartControlButton = ({ unitId }: { unitId: string }) => {
  const { unitClockingFlags, soloModeUnitId } = store.useSnapshot();
  const clockingActive = unitClockingFlags[unitId] !== false;
  const isSoloMode = !!soloModeUnitId;
  const isSoloTarget = unitId === soloModeUnitId;
  const active = isSoloMode ? isSoloTarget : clockingActive;
  return (
    <div className="mx-4px -mt-2px">
      <PartControlIconButtonView
        active={active}
        onTap={() => {
          const isSoloMode = !!store.state.soloModeUnitId;
          if (isSoloMode) {
            actions.toggleSoloModeUnit(unitId);
          } else {
            actions.toggleUnitClockingFlag(unitId);
          }
        }}
        onHold={() => {
          actions.toggleSoloModeUnit(unitId);
        }}
      >
        {isSoloMode ? <Icons.Flash /> : <Icons.Power />}
      </PartControlIconButtonView>
    </div>
  );
};
