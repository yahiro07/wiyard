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

export type GeneralUnitItem = {
  type: "general";
  unitId: string;
  catalogKey: CatalogKey;
  cardPosition: Point;
  windowPosition: Point;
};

export type InternalUnitItem = {
  type: "internal";
  unitId: string;
  internalUnitKey: InternalUnitKey;
  cardPosition: Point;
  windowPosition: Point;
};

export type UnitItem = GeneralUnitItem | InternalUnitItem;
