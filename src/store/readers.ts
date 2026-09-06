import {
  PortStuff,
  UnitItem,
  UnitPortSpec,
  UnitStuff,
  WireStuff,
} from "@/domain/types";
import { store } from "@/store/store";
import { Point } from "@/utils/drag-session";
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
  mapPortStuffs(
    unitItems: UnitItem[],
    unitStuffs: Record<string, UnitStuff>,
    portRelativePositions: Record<string, Point>,
  ): PortStuff[] {
    const mapPortSpec = (portSpec: UnitPortSpec) => {
      const { portKey, direction, subtype } = portSpec;
      const unitId = portKey.split(".")[0];
      const unitItem = unitItems.find((unit) => unit.unitId === unitId);
      if (!(unitItem?.type === "board" || unitItem?.type === "edge"))
        return undefined;
      const relativePos = portRelativePositions[portKey];
      if (!relativePos) return undefined;
      const position = {
        x: unitItem.cardPosition.x + relativePos.x,
        y: unitItem.cardPosition.y + relativePos.y,
      };
      return {
        portKey,
        direction,
        subtype,
        unitId,
        position,
      };
    };
    return Object.values(unitStuffs)
      .flatMap((unitStuff) => {
        return [
          ...(unitStuff.inputPortSpecs?.map(mapPortSpec) ?? []),
          ...(unitStuff.outputPortSpecs?.map(mapPortSpec) ?? []),
        ];
      })
      .filter(Boolean) as PortStuff[];
  },
};

const wireStuffsCache = createSingleCache(readersInternal.mapWireStuffs);
const portStuffsCache = createSingleCache(readersInternal.mapPortStuffs);

export const readers = {
  getWireStuffs(): WireStuff[] {
    const { wireConnectionKeys } = store.state;
    return wireStuffsCache.getCached(wireConnectionKeys);
  },
  useWireStuffs(): WireStuff[] {
    const { wireConnectionKeys } = store.useSnapshot();
    return wireStuffsCache.getCached(wireConnectionKeys);
  },
  getPortStuffs(): PortStuff[] {
    const { unitItems, unitStuffs, portRelativePositions } = store.state;
    return portStuffsCache.getCached(
      unitItems,
      unitStuffs,
      portRelativePositions,
    );
  },
  usePortStuffs(): PortStuff[] {
    const { unitItems, unitStuffs, portRelativePositions } =
      store.useSnapshot();
    return portStuffsCache.getCached(
      unitItems,
      unitStuffs,
      portRelativePositions,
    );
  },
};
