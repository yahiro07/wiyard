import { useMemo } from "react";
import { HsPortSubtype } from "wafer-host/core";
import { splitConnectionKey } from "@/domain/port-helpers";
import { store } from "@/store/store";

export const wireGetters = {
  useBoardUnitSubtypedConnectionKeys(subtype: HsPortSubtype) {
    const { wireConnectionKeys, portStuffs } = store.useSnapshot();
    return useMemo(() => {
      return wireConnectionKeys.filter((key) => {
        const [sourcePortKey] = splitConnectionKey(key);
        const sourcePortStuff = portStuffs[sourcePortKey];
        const sourceSubType = sourcePortStuff?.subtype;
        return sourceSubType === subtype;
      });
    }, [wireConnectionKeys, portStuffs]);
  },
};
