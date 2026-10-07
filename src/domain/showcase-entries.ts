import { allCatalogItems, CatalogKey } from "@/domain/unit-entries";
import { literalIncludedIn } from "@lib/utils/array-object-helper";

export const showcaseEntries = allCatalogItems;

export const unitPlaybackCapabilityFlags = Object.fromEntries(
  allCatalogItems.map((item) => [
    item.catalogKey,
    item.unitType === "sequencer" ||
      item.category === "stepSequencer" ||
      item.category === "drumMachine" ||
      literalIncludedIn(item.catalogKey, [
        "graphiteDrumMachine",
        "js808",
        "technoBeatMachine",
        "bs03",
        "shinyDrumMachine",
      ]),
  ]),
);

export const instrumentUnitOutputLevelScales: { [key in CatalogKey]?: number } =
  {
    graphiteDrumMachine: 0.33,
    technoBeatMachine: 0.5,
    js808: 0.7,
    shinyDrumMachine: 0.6,
    bs03: 0.5,
    superOscillator: 1.5,
    webaudioTinysynthMini: 0.7,
    webaudioSynthV2: 0.4,
    reactSynth: 0.8,
    polySynth: 0.6,
    model1: 0.5,
    pg01web: 0.8,
    sirius: 0.7,
    orion: 1,
    luna: 1,
    altairXm: 0.5,
    radiantRs: 1,
  };
