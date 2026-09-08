import { HostAppProvider } from "wafer-host/react";
import { hostSystem } from "@/domain/host-system-instance";
import { useMidiInputHandling } from "@/periphery/midi-input-handling";
import { PageRoot } from "@/realms/desk/page-root";

export const App = () => {
  useMidiInputHandling();
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <PageRoot />
    </HostAppProvider>
  );
};
