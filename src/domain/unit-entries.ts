import { IconType } from "react-icons";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { UnitInventorySpec } from "wafer-host/vite-plugin";
import { Icons } from "@/common/icons";
import { createNoteInputPortUnit } from "@/units/note-input-port";
import { createSpeakerPortUnit } from "@/units/speaker-port";
import unitInventories from "../unit-inventories.json";

export type CatalogKey = keyof typeof unitInventories;

const catalog = unitInventories as Record<CatalogKey, UnitInventorySpec>;

export { catalog };

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

export type InternalUnitKey = keyof typeof internalUnitSpecs;

// export type UnitTypeEx = UnitType | "system";

// export type ShowcaseEntry = {
//   name: string;
//   catalogKey: CatalogKey;
//   unitType: UnitTypeEx;
//   thumbnailUrl?: string;
// };
