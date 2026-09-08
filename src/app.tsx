import { HostAppProvider } from "wafer-host/react";
import { hostSystem } from "@/domain/host-system-instance";
import { useMidiInputHandling } from "@/periphery/midi-input-handling";
import { PageRoot } from "@/realms/desk/page-root";
import { store } from "@/store/store";

export const App = () => {
  const { playing, bpm, masterVolume } = store.useSnapshot();
  useMidiInputHandling();
  return (
    <HostAppProvider
      hostSystem={hostSystem}
      playing={playing}
      bpm={bpm}
      masterGain={masterVolume}
    >
      <PageRoot />
    </HostAppProvider>
  );
};
