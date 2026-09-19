import { allCatalogItems } from "@/domain/unit-entries";
import { literalIncludedIn } from "@lib/utils/array-object-helper";

export const showcaseEntries = allCatalogItems.filter(
  (item) => item.catalogKey !== "fluoritePianoRoll",
);

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
      ]),
  ]),
);
