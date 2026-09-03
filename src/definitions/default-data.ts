import { UnitItem } from "@/definitions/unit-entries";
import { Point } from "@/utils/drag-session";

const ox = 100;
const oy = 40;
export const defaultWindowPosition: Point = { x: -1, y: -1 };
export const initialUnitItems: UnitItem[] = [
  {
    type: "edge",
    unitId: "noteInputPort0",
    noteChannel: 0,
    internalUnitKey: "noteInputPort",
    cardPosition: { x: ox + 50, y: oy },
    windowPosition: defaultWindowPosition,
  },
  {
    type: "edge",
    unitId: "speakerPort",
    noteChannel: -1,
    internalUnitKey: "speakerPort",
    cardPosition: { x: ox + 900, y: oy },
    windowPosition: defaultWindowPosition,
  },
  {
    type: "board",
    unitId: "drum1",
    catalogKey: "js808",
    cardPosition: { x: ox + 200, y: oy },
    windowPosition: defaultWindowPosition,
  },
  {
    type: "board",
    unitId: "synth1",
    catalogKey: "webaudioTinysynthMini",
    cardPosition: { x: ox + 500, y: oy + 350 },
    windowPosition: defaultWindowPosition,
  },
  {
    type: "board",
    unitId: "effect1",
    catalogKey: "sunsetDelay",
    cardPosition: { x: ox + 700, y: oy },
    windowPosition: defaultWindowPosition,
  },
];
initialUnitItems.forEach((item) => {
  if (item.type === "board") {
    item.windowPosition = item.cardPosition;
  }
});
