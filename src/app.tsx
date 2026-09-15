import { useEffect } from "react";
import { HostAppProvider } from "wafer-host/react";
import { hostSystem } from "@/domain/host-system-instance";
import { useMidiInputHandling } from "@/periphery/midi-input-handling";
import { useSetupSongKeySupport } from "@/periphery/song-key-support";
import { useProjectInitialStateFix } from "@/periphery/store-state-fix";
import { setupAutoPersistenceTask } from "@/store/persistence";
import { store } from "@/store/store";
import { PageRoot } from "@/views/desk/page-root";

const EffectsHookBox = () => {
  useMidiInputHandling();
  useEffect(setupAutoPersistenceTask, []);
  useSetupSongKeySupport();
  useProjectInitialStateFix();
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
