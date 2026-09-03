import { HostAppProvider } from "wafer-host/react";
import { createHostSystem } from "wafer-host/core";

const hostSystem = createHostSystem();

export const App = () => {
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <div className="h-dvh flex-v text-white">
        <div className="h-50px bg-gray-500"></div>
        <div className="flex-grow bg-gray-400">aa</div>
        <div className="bg-gray-500 flex-c h-120px">keyboard area</div>
      </div>
    </HostAppProvider>
  );
};
