import { useEffect } from "react";
import { HostAppProvider } from "wafer-host/react";
import { hostSystem } from "@/domain/host-system-instance";
import { useMidiInputHandling } from "@/periphery/midi-input-handling";
import { PageRoot } from "@/realms/desk/page-root";
import { setupAutoPersistenceTask } from "@/store/persistence";
import { store } from "@/store/store";

const EffectsHookBox = () => {
  useMidiInputHandling();
  useEffect(setupAutoPersistenceTask, []);
  return null;
};

export const App = () => {
  const { playing, bpm, masterVolume } = store.useSnapshot();
  return (
    <HostAppProvider
      hostSystem={hostSystem}
      playing={playing}
      bpm={bpm}
      masterGain={masterVolume}
    >
      <PageRoot />
      <EffectsHookBox />
    </HostAppProvider>
  );
};
