import { HostAppProvider } from "wafer-host/react";
import { hostSystem } from "@/domain/host-system-instance";
import { DeskArea } from "@/realms/desk/desk-area";

const TopBar = () => {
  return (
    <div className="h-50px bg-gray-600 flex-c text-lg px-2 relative">
      <div className="absolute-full pointer-events-none">
        under development...
      </div>
    </div>
  );
};
const BottomBar = () => {
  return <div className="h-50px bg-gray-600 flex-c text-lg px-2"></div>;
};

const SideBar = () => {
  return <div className="w-60px bg-gray-600/80 flex-c text-lg px-2"></div>;
};

export const App = () => {
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <div className="h-dvh flex-v text-white">
        <TopBar />
        <div className="grow flex-h">
          <SideBar />
          <DeskArea />
        </div>
        <BottomBar />
      </div>
    </HostAppProvider>
  );
};
