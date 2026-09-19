import { useEffect, useMemo } from "react";
import {
  HostAppProvider,
  useSequencerTickDriverRunner,
} from "wafer-host/react";
import { hostSystem, sequencerTickDriver } from "@/domain/host-system-instance";
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

const EffectsHookBox = () => {
  useMidiInputHandling();
  useEffect(setupAutoPersistenceTask, []);
  useSetupSongKeySupport();
  useProjectInitialStateFix();
  useSetupUnitPortMasking();
  usePlaybackController();
  return null;
};

const AppInner = () => {
  const { playing, bpm, masterVolume } = store.useSnapshot();
  const masterGain = useMemo(
    () => mapKnobGainDb(masterVolume, 0.5),
    [masterVolume],
  );
  useSequencerTickDriverRunner({ sequencerTickDriver, playing, bpm });
  return (
    <HostAppProvider
      hostSystem={hostSystem}
      playing={playing}
      bpm={bpm}
      masterGain={masterGain}
      manualClocking
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
