const homeDir = process.env.HOME;

function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

const unitsDevDistDir = toAbsolutePath(
  "../../webaudio-unit-system/unit-examples/dist",
);

// const wusUnitsLocalDistDir = toAbsolutePath("../../../../wus-units/dist");

export const unitSourceUrls = [
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r6/wavicle/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r6/specbar/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r6/proto-engine-ptm-osc/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r6/proto-engine-pd-fm/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r6/mini-synth/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r6/mini-synth-ge/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r6/mini-synth-gp/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r6/useq/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r6/lseq1/",

  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r8/additive/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r8/drum-machine/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r8/wasyn-1/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r8/webaudio-tinysynth-simple/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r8/bc-010/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r8/koodori/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r8/webaudio-synth-v2/",
  `file://${homeDir}/wus-units/my-drum-machine/`,
  `file://${homeDir}/wus-units/twsq1/`,
  `file://${unitsDevDistDir}/mu1-instrument/`,
  `file://${unitsDevDistDir}/mu2-sequencer/`,
  `file://${unitsDevDistDir}/mu3-effect/`,
  `file://${unitsDevDistDir}/mu4-keyboard/`,
  `file://${unitsDevDistDir}/mu5-visualizer/`,
];
