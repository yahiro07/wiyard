import { IconType } from "react-icons";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { Icons } from "@/common/icons";
import { createNoteInputPortUnit } from "@/units/note-input-port";
import { createSpeakerPortUnit } from "@/units/speaker-port";
import catalog from "../unit-inventories.json";

export { catalog };

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

export type InternalUnitKey = keyof typeof internalUnitSpecs;
