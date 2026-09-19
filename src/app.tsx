import { useEffect } from "react";
import { HostAppProvider } from "wafer-host/react";
import { hostSystem } from "@/domain/host-system-instance";
import { setupAutoPersistenceTask } from "@/periphery/auto-persistence-task";
import { useMidiInputHandling } from "@/periphery/midi-input-handling";
import { useSetupSongKeySupport } from "@/periphery/song-key-support";
import { useProjectInitialStateFix } from "@/periphery/store-state-fix";
import { store } from "@/store/store";
import { PageRoot } from "@/views/desk/page-root";
import { useSetupUnitPortMasking } from "@/periphery/unit-port-masking-support";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackRender } from "@/periphery/fallback-render";

const EffectsHookBox = () => {
  useMidiInputHandling();
  useEffect(setupAutoPersistenceTask, []);
  useSetupSongKeySupport();
  useProjectInitialStateFix();
  useSetupUnitPortMasking();
  return null;
};

const AppInner = () => {
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

export const App = () => {
  return (
    <ErrorBoundary fallbackRender={FallbackRender}>
      <AppInner />
    </ErrorBoundary>
  );
};
