import { WireStuff } from "@/domain/types";
import { store } from "@/store/store";
import { createSingleCache } from "@/utils/single-cache";

const readersInternal = {
  mapWireStuffs(wireConnectionKeys: string[]): WireStuff[] {
    return wireConnectionKeys.map((key) => {
      const [sourcePortKey, destinationPortKey] = key.split("-");
      const [sourceUnitId] = sourcePortKey.split(".");
      const [destinationUnitId] = destinationPortKey.split(".");
      return {
        connectionKey: key,
        sourcePortKey,
        destinationPortKey,
        sourceUnitId,
        destinationUnitId,
      };
    });
  },
};

const wireStuffsCache = createSingleCache(readersInternal.mapWireStuffs);

export const readers = {
  getWireStuffs(): WireStuff[] {
    const { wireConnectionKeys } = store.state;
    return wireStuffsCache.getCached(wireConnectionKeys);
  },
  useWireStuffs(): WireStuff[] {
    const { wireConnectionKeys } = store.useSnapshot();
    return wireStuffsCache.getCached(wireConnectionKeys);
  },
};
