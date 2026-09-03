import { UnitItem } from "@/definitions/unit-entries";
import { Point } from "@/utils/drag-session";

const ox = 100;
const oy = 40;
export const defaultWindowPosition: Point = { x: -1, y: -1 };
export const initialUnitItems: UnitItem[] = [
  {
    type: "internal",
    unitId: "noteInputPort1",
    internalUnitKey: "noteInputPort",
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
