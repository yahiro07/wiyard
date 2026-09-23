import { ReactNode, useEffect, useMemo } from "react";
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
import { mapKnobGainDb } from "@lib/utils/volume-curve";
import { usePlaybackController } from "@/periphery/playback-controller";

function useUpdateDebugValues() {
  const { windowSpecs } = store.useSnapshot();
  useEffect(() => {
    store.setDebugObject(windowSpecs);
  }, [windowSpecs]);
}

const EffectsHookBox = () => {
  useMidiInputHandling();
  useEffect(setupAutoPersistenceTask, []);
  useSetupSongKeySupport();
  useProjectInitialStateFix();
  useSetupUnitPortMasking();
  usePlaybackController();
  useUpdateDebugValues();
  return null;
};

const HostAppProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { playing, bpm, masterVolume } = store.useSnapshot();
  const masterGain = useMemo(
    () => mapKnobGainDb(masterVolume, 0.5),
    [masterVolume],
  );
  return (
    <HostAppProvider
      hostSystem={hostSystem}
      playing={playing}
      bpm={bpm}
      masterGain={masterGain}
      manualClocking
    >
      {children}
    </HostAppProvider>
  );
};

const AppInner = () => {
  return (
    <HostAppProviderWrapper>
      <PageRoot />
      <EffectsHookBox />
    </HostAppProviderWrapper>
  );
};

export const App = () => {
  return (
    <ErrorBoundary fallbackRender={FallbackRender}>
      <AppInner />
    </ErrorBoundary>
  );
};
