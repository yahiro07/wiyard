import { sequencerTickDriver } from "@/domain/host-system-instance";
import { store } from "@/store/store";
import { useEffect } from "react";

export function usePlaybackController() {
  const { soloPlaybackUnitId } = store.useSnapshot();
  useEffect(() => {
    if (soloPlaybackUnitId) {
      sequencerTickDriver.setUnitClockingFlags({
        [soloPlaybackUnitId]: true,
      });
      sequencerTickDriver.start();
    } else {
      sequencerTickDriver.setUnitClockingFlags(null);
      sequencerTickDriver.stop();
    }
  }, [soloPlaybackUnitId]);
}
