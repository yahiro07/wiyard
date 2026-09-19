import { sequencerTickDriver } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { useEffect } from "react";

export function usePlaybackController() {
  const { soloPlaybackUnitId, bpm, playing } = store.useSnapshot();
  useEffect(() => {
    if (bpm) {
      sequencerTickDriver?.setBpm(bpm);
    }
  }, [bpm]);

  useEffect(() => {
    if (soloPlaybackUnitId || playing) {
      if (soloPlaybackUnitId) {
        sequencerTickDriver.setUnitClockingFlags({
          [soloPlaybackUnitId]: true,
        });
      } else {
        sequencerTickDriver.setUnitClockingFlags(null);
      }
      sequencerTickDriver.start();
    } else {
      sequencerTickDriver.setUnitClockingFlags(null);
      sequencerTickDriver.stop();
    }
  }, [soloPlaybackUnitId, playing]);
}
