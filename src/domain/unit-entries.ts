import { createPianoRollUnit } from "@lib/piano-roll";
import {
  createNoteInputPortUnit,
  createSpeakerPortUnit,
} from "@lib/port-units";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { UnitInventorySpec } from "wafer-host/vite-plugin";
import { Icons } from "@/common/icons";
import unitInventories from "../unit-inventories.json";
import { createKeyboardUnit } from "@lib/keyboard";
import { createAutomationEditorUnit } from "@lib/automation-editor";
import { createControlSurfaceUnit } from "@lib/control-surface";

export type CatalogKey = keyof typeof unitInventories;

const catalog = unitInventories as Record<
  CatalogKey,
  UnitInventorySpec & { catalogKey: CatalogKey }
>;

export { catalog };

export type InternalUnitKey =
  | "speakerPort"
  | "noteInputPort"
  | "pianoRoll"
  | "keyboard"
  | "automationEditor"
  | "controlSurface";

export const interUnitFactories: Record<InternalUnitKey, ReactUnitTemplateFn> =
  {
    speakerPort: createSpeakerPortUnit,
    noteInputPort: createNoteInputPortUnit,
    pianoRoll: createPianoRollUnit,
    keyboard: createKeyboardUnit,
    automationEditor: createAutomationEditorUnit,
    controlSurface: createControlSurfaceUnit,
  };

export const internalUnitCardIcons = {
  speakerPort: Icons.ArrowRightToBracket,
  noteInputPort: Icons.ArrowRightFromBracket,
  automationChannel: Icons.ArrowRightFromBracket,
  controlSurface: Icons.DirectionRight,
};

export type UnitClassKey = CatalogKey | InternalUnitKey;

export const builtinUnitIds = {
  keyboard: "keyboard",
  controlSurface: "controlSurface",
};
