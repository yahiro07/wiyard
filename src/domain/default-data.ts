import { appConfig } from "@/domain/app-config";
import { OffStageUnitItem, UnitItem } from "@/domain/types";

function createDefaultScene() {
  const ox = 100;
  const oy = 200;

  const unitItems: UnitItem[] = [
    {
      type: "edge",
      unitId: "noteInputPort1",
      noteChannelId: "nc1",
      internalUnitKey: "noteInputPort",
      cardPosition: { x: ox + 50, y: oy + 200 },
    },
    {
      type: "edge",
      unitId: "speakerPort",
      noteChannelId: "",
      internalUnitKey: "speakerPort",
      cardPosition: { x: ox + 1000, y: oy + 200 },
    },
    {
      type: "board",
      unitId: "drum1",
      catalogKey: "js808",
      cardPosition: { x: ox + 400, y: oy },
    },
    {
      type: "board",
      unitId: "synth1",
      catalogKey: "webaudioTinysynthMini",
      cardPosition: { x: ox + 400, y: oy + 200 },
    },
    {
      type: "board",
      unitId: "effect1",
      catalogKey: "sunsetDelay",
      cardPosition: { x: ox + 700, y: oy + 200 },
    },
  ];
  const offStageUnitItems: OffStageUnitItem[] = [
    {
      unitId: "sequencer1",
      noteChannelId: "nc1",
      unitClassKey: "pianoRoll",
    },
  ];

  const wireConnectionKeys = [
    "noteInputPort1.noteOutput-synth1.noteInput",
    "speakerPort.audioOutput-$output",
    "drum1.audioOutput-speakerPort.audioInput",
    "synth1.audioOutput-effect1.audioInput",
    "effect1.audioOutput-speakerPort.audioInput",
  ];

  if (appConfig.isDevelopment) {
    offStageUnitItems.push({
      unitId: "sequencer2",
      noteChannelId: "nc2",
      unitClassKey: "fluoritePianoRoll",
    });
    unitItems.push({
      type: "edge",
      unitId: "noteInputPort2",
      noteChannelId: "nc2",
      internalUnitKey: "noteInputPort",
      cardPosition: { x: ox + 50, y: oy + 350 },
    });
  }

  return {
    offStageUnitItems,
    unitItems,
    initialNoteChannelId: "nc1",
    wireConnectionKeys,
  };
}

export const defaultScene = createDefaultScene();
