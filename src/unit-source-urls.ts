function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

export function getUnitSourceUrls(debugUseLocalUnits?: boolean) {
  if (!debugUseLocalUnits) {
    const waferUnitsBase = `https://github.com/yahiro07/wafer-units/tree/r25`;
    const waferCustomUnitsBase = `https://github.com/yahiro07/wafer-custom-units/tree/r21`;

    return [
      `${waferUnitsBase}/fluorite-piano-roll/`,
      `${waferCustomUnitsBase}/js808/`,
      `${waferCustomUnitsBase}/webaudio-tinysynth-mini/`,
      `${waferUnitsBase}/sunset-delay/`,
    ];
  } else {
    const waferUnitsLocalDistDir = toAbsolutePath("../../wafer-units/dist");
    const waferCustomUnitsLocalDir = toAbsolutePath("../../wafer-custom-units");
    return [
      `file://${waferCustomUnitsLocalDir}/js/webaudio-tinysynth-mini/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/super-oscillator/`,
      `file://${waferCustomUnitsLocalDir}/js/midi-synth/`,
      `file://${waferCustomUnitsLocalDir}/js/webaudio-synth-v2/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/js808/`,
      `file://${waferCustomUnitsLocalDir}/js/shiny-drum-machine/`,

      `file://${waferUnitsLocalDistDir}/fluorite-piano-roll/`,
      `file://${waferUnitsLocalDistDir}/partex/`,

      `file://${waferCustomUnitsLocalDir}/js/web-audio-mixer/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/vue-audio-mixer/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/beatmaker/`,
      `file://${waferUnitsLocalDistDir}/sunset-delay/`,
      `file://${waferUnitsLocalDistDir}/sunset-chorus-mini/`,
      `file://${waferUnitsLocalDistDir}/lofi2/`,
      `file://${waferCustomUnitsLocalDir}/js/darkwave/`,

      `file://${waferCustomUnitsLocalDir}/js/additive/`,
      `file://${waferCustomUnitsLocalDir}/js/bl-synth-modular/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/cadence/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/react-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/poly-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/model-1/`,

      `file://${waferCustomUnitsLocalDir}/js/wasyn-1/`,
      `file://${waferUnitsLocalDistDir}/drum-loop-player/`,

      `file://${waferUnitsLocalDistDir}/step-automator/`,
      `file://${waferUnitsLocalDistDir}/multi-lfo/`,
    ];
  }
}
