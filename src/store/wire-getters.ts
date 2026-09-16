import { useMemo } from "react";
import { store } from "@/store/store";

export const wireGetters = {
  useBoardUnitAudioConnectionKeys() {
    const { wireConnectionKeys, portStuffs } = store.useSnapshot();
    return useMemo(() => {
      return wireConnectionKeys.filter((key) => {
        const [sourcePortKey] = key.split("-");
        const sourcePortStuff = portStuffs[sourcePortKey];
        const sourceSubType = sourcePortStuff?.subtype;
        return sourceSubType === "audio";
      });
    }, [wireConnectionKeys, portStuffs]);
  },
};
