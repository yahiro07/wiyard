import { HsPortDirection, HsPortSubtype } from "wafer-host/core";
import { Point, Size } from "@/domain/common-types";
import { CatalogKey, UnitClassKey } from "@/domain/unit-entries";

export type BoardUnitItem = {
  type: "board";
  unitId: string;
  catalogKey: CatalogKey;
  cardPosition: Point;
};

export type NoteInputPortUnitItem = {
  type: "noteInput";
  unitId: string;
  sequencerClassKey: UnitClassKey;
  cardPosition: Point;
};

export type SpeakerPortUnitItem = {
  type: "speaker";
  unitId: string;
  cardPosition: Point;
};

export type UnitItem =
  | BoardUnitItem
  | NoteInputPortUnitItem
  | SpeakerPortUnitItem;

export type WindowId = string; //unitId | "sequencerWindow"
export const kSequencerWindowId = "sequencerWindow";

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
