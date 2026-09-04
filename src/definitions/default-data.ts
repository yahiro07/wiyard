import { appConfig } from "@/definitions/app-config";
import { UnitItem } from "@/definitions/unit-entries";
import { Point } from "@/utils/drag-session";

const ox = 100;
const oy = 40;
export const defaultWindowPosition: Point = { x: -1, y: -1 };

const initialUnitItems: UnitItem[] = [
  {
    type: "offStage",
    unitId: "sequencer1",
    noteChannelId: "nc1",
    catalogKey: "fluoritePianoRoll",
  },
  {
    type: "edge",
    unitId: "noteInputPort1",
    noteChannelId: "nc1",
    internalUnitKey: "noteInputPort",
    cardPosition: { x: ox + 50, y: oy },
    windowPosition: defaultWindowPosition,
  },
  {
    type: "edge",
    unitId: "speakerPort",
    noteChannelId: "",
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

if (appConfig.isDevelopment) {
  initialUnitItems.push(
    {
      type: "offStage",
      unitId: "sequencer2",
      noteChannelId: "nc2",
      catalogKey: "fluoritePianoRoll",
    },
    {
      type: "edge",
      unitId: "noteInputPort2",
      noteChannelId: "nc2",
      internalUnitKey: "noteInputPort",
      cardPosition: { x: ox + 50, y: oy + 250 },
      windowPosition: defaultWindowPosition,
    },
  );
}

export const defaultScene = {
  unitItems: initialUnitItems,
  initialNoteChannelId: "nc1",
};
