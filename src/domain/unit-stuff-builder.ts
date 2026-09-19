import {
  HsPortInfoAdditional,
  HsPortInfoPrimaryInner,
  HsUnitInstance,
} from "wafer-host/core";
import { appConfig } from "@/common/app-config";
import { UnitStuff } from "@/domain/types";
import { builtinUnitIds } from "@/domain/unit-entries";

const subtypeOrder = ["audio", "note", "automation"];

const supportedSubtypes = appConfig.supportAutomationPorts
  ? ["audio", "note", "automation"]
  : ["audio", "note"];

export function buildUnitStuffLoaded(unitInstance: HsUnitInstance): UnitStuff {
  const { unitId, portInfos } = unitInstance;

  const portsIncluded = portInfos
    .filter(
      (p) =>
        (p.type === "primaryInner" || p.type === "additional") &&
        supportedSubtypes.includes(p.subtype),
    )
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
  const inputPortSpecs = portsIncluded.filter((p) => p.direction === "input");
  const outputPortSpecs = portsIncluded.filter((p) => p.direction === "output");

  const automationPort = unitInstance.automationInput;
  const automationParameterSpecs = automationPort?.getParameterSpecs();

  let outputPortsOptInFlags: Record<string, boolean> | undefined;
  if (unitId === builtinUnitIds.controlSurface) {
    outputPortsOptInFlags = Object.fromEntries(
      outputPortSpecs.map((p) => [p.id, false]),
    );
  }

  return {
    status: "loaded",
    inputPortSpecs,
    outputPortSpecs,
    automationParameterSpecs,
    outputPortsOptInFlags,
  };
}
