import { useMemo } from "react";
import { HsPortSubtype } from "wafer-host/core";
import { store } from "@/store/store";

export const wireGetters = {
  useBoardUnitSubtypedConnectionKeys(subtype: HsPortSubtype) {
    const { wireConnectionKeys, portStuffs } = store.useSnapshot();
    return useMemo(() => {
      return wireConnectionKeys.filter((key) => {
        const [sourcePortKey] = key.split("-");
        const sourcePortStuff = portStuffs[sourcePortKey];
        const sourceSubType = sourcePortStuff?.subtype;
        return sourceSubType === subtype;
      });
    }, [wireConnectionKeys, portStuffs]);
  },
};
