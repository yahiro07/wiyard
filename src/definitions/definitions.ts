import { IconType } from "react-icons";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { Icons } from "@/common/icons";
import { createKeyboardPortUnit } from "@/features/internal-units/keyboard-port";
import { createSpeakerPortUnit } from "@/features/internal-units/speaker-port";
import catalog from "../unit-inventories.json";

type Point = { x: number; y: number };
type Size = { width: number; height: number };

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
  keyboardPort: {
    factory: createKeyboardPortUnit,
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

const ox = 100;
const oy = 40;
export const defaultWindowPosition: Point = { x: -1, y: -1 };
export const initialUnitItems: UnitItem[] = [
  {
    type: "internal",
    unitId: "keyboardPort",
    internalUnitKey: "keyboardPort",
    cardPosition: { x: ox + 50, y: oy },
    windowPosition: defaultWindowPosition,
  },
  {
    type: "internal",
    unitId: "speakerPort",
    internalUnitKey: "speakerPort",
    cardPosition: { x: ox + 900, y: oy },
    windowPosition: defaultWindowPosition,
  },
  {
    type: "general",
    unitId: "drum1",
    catalogKey: "js808",
    cardPosition: { x: ox + 200, y: oy },
    windowPosition: defaultWindowPosition,
  },
  {
    type: "general",
    unitId: "synth1",
    catalogKey: "webaudioTinysynthMini",
    cardPosition: { x: ox + 500, y: oy + 350 },
    windowPosition: defaultWindowPosition,
  },
  {
    type: "general",
    unitId: "effect1",
    catalogKey: "sunsetDelay",
    cardPosition: { x: ox + 700, y: oy },
    windowPosition: defaultWindowPosition,
  },
];
initialUnitItems.forEach((item) => {
  if (item.type === "general") {
    item.windowPosition = item.cardPosition;
  }
});
