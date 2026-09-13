import { appConfig } from "@/domain/app-config";
import { UnitItem } from "@/domain/types";

const ox = 2000 - 500;
const oy = 1400 - 350;

function createDefaultScene() {
  const unitItems: UnitItem[] = [
    {
      type: "noteInput",
      unitId: "noteInputPort1",
      sequencerClassKey: "pianoRoll",
      cardPosition: { x: ox + 50, y: oy + 200 },
    },
    {
      type: "speaker",
      unitId: "speakerPort",
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

  const wireConnectionKeys = [
    "noteInputPort1.noteOutput-synth1.noteInput",
    "drum1.audioOutput-speakerPort.audioInput",
    "synth1.audioOutput-effect1.audioInput",
    "effect1.audioOutput-speakerPort.audioInput",
  ];

  if (appConfig.isDevelopment) {
    unitItems.push({
      type: "noteInput",
      unitId: "noteInputPort2",
      sequencerClassKey: "pianoRoll",
      cardPosition: { x: ox + 50, y: oy + 350 },
    });
  }

  return {
    unitItems,
    currentNoteChannelId: "noteInputPort1",
    wireConnectionKeys,
    sight: { eyeScaling: 1, eyeOffset: { x: 0, y: 0 } },
  };
}

export const defaultScene = createDefaultScene();

function createBlankScene() {
  const unitItems: UnitItem[] = [
    {
      type: "noteInput",
      unitId: "noteInputPort1",
      sequencerClassKey: "pianoRoll",
      cardPosition: { x: ox + 50, y: oy + 200 },
    },
    {
      type: "speaker",
      unitId: "speakerPort",
      cardPosition: { x: ox + 1000, y: oy + 200 },
    },
  ];
  return {
    unitItems,
    currentNoteChannelId: "noteInputPort1",
    sight: { eyeScaling: 1, eyeOffset: { x: 0, y: 0 } },
  };
}
export const blankScene = createBlankScene();
