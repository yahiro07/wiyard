import { Icons } from "@/common/icons";
import { store } from "@/store/store";
import { Button } from "@/views/settings/components/button";
import { useHandleClickOutside } from "@lib/utils/use-handle-click-outside";
import { useRef } from "react";

const InfoPanelTabButtons = () => {
  const { infoPanelTab } = store.useSnapshot();
  return (
    <div className="flex-ha gap-1.5">
      <Button
        active={infoPanelTab === "about"}
        onClick={() => store.setInfoPanelTab("about")}
      >
        About
      </Button>
      <Button
        active={infoPanelTab === "credits"}
        onClick={() => store.setInfoPanelTab("credits")}
      >
        Credits
      </Button>
    </div>
  );
};

const AboutContent = () => {
  return (
    <div className="text-sm flex-v gap-3">
      <p>
        Wiyard is a WebAudio-based audio host application. It's based on the
        Wafer plugin protocol and supports many units, including synthesizers,
        drum machines, and effects.
      </p>
      <p>
        The protocol is designed to be compatible with existing WebAudio apps.
        Under this protocol, several open-source WebAudio apps have been ported
        and included in this app.
      </p>
      <p>
        The graph-editing interface follows the style of Patcher (in FL Studio).
        Since this app is intended for creating multi-part phrases as a
        standalone application, the inputs are extended to multiple ports, and
        it includes a built-in piano roll editor to feed the notes to them.
      </p>
      <p>
        An desktop-like, scalable window system is used to make the workflow
        more efficient. You can place many windows in a large desk space, and
        zoom or pan the desk surface.
      </p>
      <p>
        The source code is available on GitHub. For detailed usage, please refer
        to the documentation in the repository.
      </p>
    </div>
  );
};

const CreditsContent = () => {
  return (
    <div>
      <h1>Credits</h1>
    </div>
  );
};

const SettingsPanel = () => {
  const { infoPanelTab } = store.useSnapshot();
  return (
    <div className="w-400px m-2">
      <div className="flex-ha gap-4px px-1.5 h-30px text-white bg-gray-500">
        <Icons.Info size={18} />
        <h3 className="font-500 text-17px">Information</h3>
      </div>
      <div className="bg-#ccc p-4  text-#444 min-h-400px">
        <div className="flex-v gap-2">
          <InfoPanelTabButtons />
          {infoPanelTab === "about" && <AboutContent />}
          {infoPanelTab === "credits" && <CreditsContent />}
        </div>
      </div>
    </div>
  );
};

const InfoPanelOuter = () => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  useHandleClickOutside(
    baseDivRef,
    () => {
      store.setSettingsPanelVisible(false);
    },
    {
      targetMethod: "pointerdown",
      withStopPropagation: true,
      excludeButtons: true,
    },
  );
  return (
    <div ref={baseDivRef}>
      <SettingsPanel />
    </div>
  );
};

export const InfoPanelRoot = () => {
  const { infoPanelVisible } = store.useSnapshot();
  if (!infoPanelVisible) return null;
  return (
    <div className="absolute top-0 right-0">
      <InfoPanelOuter />
    </div>
  );
};
