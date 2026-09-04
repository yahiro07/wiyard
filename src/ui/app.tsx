import { HostAppProvider } from "wafer-host/react";
import { hostSystem } from "@/store/host-system-instance";
import { DeskArea } from "@/ui/desk-area";

export const App = () => {
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <div className="h-dvh flex-v text-white">
        <div className="h-50px bg-gray-600 flex-ha text-lg px-2">
          under development...
        </div>
        <DeskArea />
      </div>
    </HostAppProvider>
  );
};
