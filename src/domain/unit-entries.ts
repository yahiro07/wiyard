import { createPianoRollUnit } from "@lib/piano-roll";
import {
  createNoteInputPortUnit,
  createSpeakerPortUnit,
} from "@lib/port-units";
import { IconType } from "react-icons";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { UnitInventorySpec } from "wafer-host/vite-plugin";
import { Icons } from "@/common/icons";
import unitInventories from "../unit-inventories.json";
import { createKeyboardUnit } from "@lib/keyboard";

export type CatalogKey = keyof typeof unitInventories;

const catalog = unitInventories as Record<
  CatalogKey,
  UnitInventorySpec & { catalogKey: CatalogKey }
>;

export { catalog };

type InternalUnitSpec = {
  factory: ReactUnitTemplateFn;
  iconComponent: IconType;
};

export type InternalUnitKey =
  | "speakerPort"
  | "noteInputPort"
  | "pianoRoll"
  | "keyboard";

export const internalUnitSpecs: Record<InternalUnitKey, InternalUnitSpec> = {
  speakerPort: {
    factory: createSpeakerPortUnit,
    iconComponent: Icons.ArrowRightToBracket,
  },
  noteInputPort: {
    factory: createNoteInputPortUnit,
    iconComponent: Icons.ArrowRightFromBracket,
  },
  pianoRoll: {
    factory: createPianoRollUnit,
    iconComponent: Icons.Piano,
  },
  keyboard: {
    factory: createKeyboardUnit,
    iconComponent: Icons.Piano,
  },
};

export type UnitClassKey = CatalogKey | InternalUnitKey;

export const kKeyboardUnitId = "keyboard";
export const kSpeakerPortUnitId = "speakerPort";
