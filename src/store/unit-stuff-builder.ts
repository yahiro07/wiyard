import {
  HsPortInfoAdditional,
  HsPortInfoPrimaryInner,
  HsUnitInstance,
} from "wafer-host/core";
import { UnitStuff } from "@/definitions/unit-stuff";

const subtypeOrder = ["audio", "note", "automation"];

export function buildUnitStuffLoaded(unitInstance: HsUnitInstance): UnitStuff {
  const { unitId, portInfos } = unitInstance;

  const portsIncluded = portInfos
    .filter((p) => p.type !== "primary")
    .map((_p) => {
      const p = _p as HsPortInfoAdditional | HsPortInfoPrimaryInner;
      return {
        direction: p.direction,
        id: p.portId,
        portKey: `${unitId}.${p.portId}`,
        subtype: p.subtype,
        label: "label" in p ? p.label : undefined,
      };
    })
    .sort((a, b) => {
      const aIndex = subtypeOrder.indexOf(a.subtype);
      const bIndex = subtypeOrder.indexOf(b.subtype);
      return aIndex - bIndex;
    });
  const inputPorts = portsIncluded.filter((p) => p.direction === "input");
  const outputPort = portsIncluded.filter((p) => p.direction === "output");
  return { status: "loaded", inputPorts, outputPort };
}
