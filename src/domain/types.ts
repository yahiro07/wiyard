import { Point, Size } from "@lib/utils/common-types";
import { HsPortDirection, HsPortSubtype } from "wafer-host/core";
import { CatalogKey } from "@/domain/unit-entries";
import { AutomationParameterSpec } from "wafer-host/unit-types";

export type BoardUnitItem = {
  type: "board";
  unitId: string;
  catalogKey: CatalogKey;
  cardPosition: Point;
};

export type NoteInputPortUnitItem = {
  type: "noteInput";
  unitId: string;
  sequencerClassKey: "pianoRoll"; // | UnitClassKey;
  cardPosition: Point;
};

export type SpeakerPortUnitItem = {
  type: "speaker";
  unitId: string;
  cardPosition: Point;
};

export type AutomationEditorUnitItem = {
  type: "automationEditor";
  unitId: string;
  //first unit card represents multiple automation editor and show their all ports
  cardPosition: Point;
};

export type ControlSurfaceUnitItem = {
  type: "controlSurface";
  unitId: string;
  cardPosition: Point;
};

export type UnitItem =
  | BoardUnitItem
  | NoteInputPortUnitItem
  | SpeakerPortUnitItem
  | AutomationEditorUnitItem
  | ControlSurfaceUnitItem;

export const windowIds = {
  pianoRoll: "pianoRollWIndow",
  keyboard: "keyboardWindow",
  automationEditor: "automationEditorWindow",
  controlSurface: "controlSurfaceWindow",
};

//unitId for board units, or value of windowIds for builtin app units
export type WindowId = string;

export type UnitPortSpec = {
  direction: HsPortDirection;
  subtype: HsPortSubtype;
  portKey: string;
  id: string;
  label?: string;
};

export type UnitStuff = {
  status: "loading" | "loaded" | "error";
  inputPortSpecs?: UnitPortSpec[];
  outputPortSpecs?: UnitPortSpec[];
  viewSize?: Size;
  automationParameterSpecs?: AutomationParameterSpec[];
  outputPortsOptInFlags?: Record<string, boolean>;
};

export type PortStuff = {
  portKey: string; //${unitId}.${portId}
  direction: HsPortDirection;
  subtype: HsPortSubtype;
  unitId: string;
  position: Point;
};

export type UnitAddingItem = {
  catalogKey: CatalogKey;
  position: Point;
};

export type GraphSpec = {
  contentOffset: Point;
  contentScaling: number;
  planeSize: Size;
};

export type UnitControlEffectItem = {
  volume: number;
  pan: number;
};
