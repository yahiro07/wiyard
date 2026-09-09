import { HsPortDirection, HsPortSubtype } from "wafer-host/core";
import { Point, Size } from "@/domain/common-types";
import { CatalogKey, InternalUnitKey } from "@/domain/unit-entries";

//instrument and effects, placed on board area
export type BoardUnitItem = {
  type: "board";
  unitId: string;
  catalogKey: CatalogKey;
  cardPosition: Point;
  windowPosition: Point;
  windowVisible: boolean;
};

//note input port and speaker output port, used for input/output of the board area
export type EdgeUnitItem = {
  type: "edge";
  unitId: string;
  noteChannelId: string;
  internalUnitKey: InternalUnitKey;
  cardPosition: Point;
  windowPosition: Point;
};

//units placed on board area
export type StageUnitItem = BoardUnitItem | EdgeUnitItem;

//sequencer units, internally managed and not displayed on the board
export type OffStageUnitItem = {
  type: "offStage";
  unitId: string;
  noteChannelId: string;
  catalogKey: CatalogKey;
};

export type UnitItem = BoardUnitItem | EdgeUnitItem | OffStageUnitItem;

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
