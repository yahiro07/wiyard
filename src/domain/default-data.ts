import { appConfig } from "@/domain/app-config";
import { Point } from "@/domain/common-types";
import { UnitItem } from "@/domain/types";

export const defaultWindowPosition: Point = { x: -1, y: -1 };

function createDefaultScene() {
  const ox = 100;
  const oy = 200;

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
      cardPosition: { x: ox + 50, y: oy + 200 },
      windowPosition: defaultWindowPosition,
    },
    {
      type: "edge",
      unitId: "speakerPort",
      noteChannelId: "",
      internalUnitKey: "speakerPort",
      cardPosition: { x: ox + 1000, y: oy + 200 },
      windowPosition: defaultWindowPosition,
    },
    {
      type: "board",
      unitId: "drum1",
      catalogKey: "js808",
      cardPosition: { x: ox + 400, y: oy },
      windowPosition: defaultWindowPosition,
      windowStatus: "none",
    },
    {
      type: "board",
      unitId: "synth1",
      catalogKey: "webaudioTinysynthMini",
      cardPosition: { x: ox + 400, y: oy + 200 },
      windowPosition: defaultWindowPosition,
      windowStatus: "none",
    },
    {
      type: "board",
      unitId: "effect1",
      catalogKey: "sunsetDelay",
      cardPosition: { x: ox + 700, y: oy + 200 },
      windowPosition: defaultWindowPosition,
      windowStatus: "none",
    },
  ];
  initialUnitItems.forEach((item) => {
    if (item.type === "board") {
      item.windowPosition = item.cardPosition;
    }
  });
  const wireConnectionKeys = [
    "noteInputPort1.noteOutput-synth1.noteInput",
    "speakerPort.audioOutput-$output",
    "drum1.audioOutput-speakerPort.audioInput",
    "synth1.audioOutput-effect1.audioInput",
    "effect1.audioOutput-speakerPort.audioInput",
  ];

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
        cardPosition: { x: ox + 50, y: oy + 350 },
        windowPosition: defaultWindowPosition,
      },
    );
  }

  return {
    unitItems: initialUnitItems,
    initialNoteChannelId: "nc1",
    wireConnectionKeys,
  };
}

export const defaultScene = createDefaultScene();
