import { sequencerTickDriver } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { useEffect } from "react";

export function usePlaybackController() {
  const {
    soloPlaybackUnitId,
    bpm,
    playing,
    unitClockingFlags,
    soloModeUnitId,
  } = store.useSnapshot();
  useEffect(() => {
    if (bpm) {
      sequencerTickDriver?.setBpm(bpm);
    }
  }, [bpm]);

  useEffect(() => {
    if (soloPlaybackUnitId || playing) {
      if (soloPlaybackUnitId) {
        sequencerTickDriver.setSceneClockingSpec({
          flags: { [soloPlaybackUnitId]: true },
          fallbackValue: false,
        });
      } else {
        if (soloModeUnitId) {
          sequencerTickDriver.setSceneClockingSpec({
            flags: { [soloModeUnitId]: true },
            fallbackValue: false,
          });
        } else {
          sequencerTickDriver.setSceneClockingSpec({
            flags: unitClockingFlags,
            fallbackValue: true,
          });
        }
      }
      sequencerTickDriver.start();
    } else {
      sequencerTickDriver.setSceneClockingSpec(null);
      sequencerTickDriver.stop();
    }
  }, [soloPlaybackUnitId, playing, unitClockingFlags, soloModeUnitId]);
}
