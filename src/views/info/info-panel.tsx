import { Icons } from "@/common/icons";
import { store } from "@/store/store";
import { AboutContents } from "@/views/info/about-contents";
import { CreditsContents } from "@/views/info/credits-contents";
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

const InfoPanel = () => {
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
          <div className="h-400px overflow-x-hidden overflow-y-scroll">
            {infoPanelTab === "about" && <AboutContents />}
            {infoPanelTab === "credits" && <CreditsContents />}
          </div>
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
      store.setInfoPanelVisible(false);
    },
    {
      targetMethod: "pointerdown",
      withStopPropagation: true,
      excludeButtons: true,
    },
  );
  return (
    <div ref={baseDivRef}>
      <InfoPanel />
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
