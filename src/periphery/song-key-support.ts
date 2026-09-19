import { MessageFromUnit } from "@lib/contract";
import { mapSongKeySpecFromKeyName } from "@lib/utils/song-key-helper";
import { useEffect } from "react";
import { hostSystem } from "@/domain/host-system-instance";
import { safeInvoke } from "@/periphery/wrap-unit-call";
import { actions } from "@/store/actions";
import { store } from "@/store/store";

export function useSetupSongKeySupport() {
  useEffect(() => {
    return hostSystem.eventPort.subscribe((ev) => {
      if (ev.type === "unitAdded") {
        const { keyName, bpm } = store.state;
        const unit = ev.unitInstance;
        const songKeySpec = mapSongKeySpecFromKeyName(keyName);
        safeInvoke(unit.hostCallbacks?.setKey)?.(songKeySpec);
        safeInvoke(unit.hostCallbacks?.setBpm)?.(bpm);
      } else if (ev.type === "messageFromUnit") {
        const message = ev.message as MessageFromUnit;
        if (message.type === "setKeyName") {
          actions.setKeyName(message.keyName);
        }
      }
    });
  }, []);

  const { keyName } = store.useSnapshot();
  useEffect(() => {
    const songKeySpec = mapSongKeySpecFromKeyName(keyName);
    hostSystem.getAllUnits().forEach((unit) => {
      safeInvoke(unit.hostCallbacks?.setKey)?.(songKeySpec);
    });
  }, [keyName]);
}
