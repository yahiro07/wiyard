import { HostAppProvider } from "wafer-host/react";
import { hostSystem } from "@/domain/host-system-instance";
import { PageRoot } from "@/realms/desk/page-root";

export const App = () => {
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <PageRoot />
    </HostAppProvider>
  );
};
