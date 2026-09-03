import { IconType } from "react-icons";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { Icons } from "@/common/icons";
import { createNoteInputPortUnit } from "@/features/internal-units/note-input-port";
import { createSpeakerPortUnit } from "@/features/internal-units/speaker-port";
import { Point } from "@/utils/drag-session";
import catalog from "../unit-inventories.json";

export type CatalogKey = keyof typeof catalog;

type InternalUnitSpec = {
  factory: ReactUnitTemplateFn;
  iconComponent: IconType;
};

export const internalUnitSpecs = {
  speakerPort: {
    factory: createSpeakerPortUnit,
    iconComponent: Icons.ArrowRightToBracket,
  },
  noteInputPort: {
    factory: createNoteInputPortUnit,
    iconComponent: Icons.ArrowRightFromBracket,
  },
} satisfies Record<string, InternalUnitSpec>;

type InternalUnitKey = keyof typeof internalUnitSpecs;

//instrument and effects, placed on board area
export type BoardUnitItem = {
  type: "board";
  unitId: string;
  catalogKey: CatalogKey;
  cardPosition: Point;
  windowPosition: Point;
};

//note input port and speaker output port, used for input/output of the board area
export type EdgeUnitItem = {
  type: "edge";
  unitId: string;
  noteChannel: number;
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
  noteChannel: number;
  catalogKey: CatalogKey;
};

export type UnitItem = BoardUnitItem | EdgeUnitItem | OffStageUnitItem;
