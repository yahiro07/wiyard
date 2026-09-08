function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

export function getUnitSourceUrls(debugUseLocalUnits?: boolean) {
  if (!debugUseLocalUnits) {
    const waferUnitsBase = `https://github.com/yahiro07/wafer-units/tree/r25`;
    const waferCustomUnitsBase = `https://github.com/yahiro07/wafer-custom-units/tree/r21`;

    return [
      `${waferUnitsBase}/fluorite-piano-roll/`,
      //
      `${waferCustomUnitsBase}/js808/`,
      `${waferCustomUnitsBase}/webaudio-tinysynth-mini/`,
      `${waferUnitsBase}/sunset-delay/`,
      `${waferUnitsBase}/graphite-drum-machine/`,
      `${waferCustomUnitsBase}/super-oscillator/`,
      `${waferCustomUnitsBase}/midi-synth/`,
      `${waferCustomUnitsBase}/webaudio-synth-v2/`,
      `${waferUnitsBase}/bs03/`,
      `${waferUnitsBase}/techno-beat-machine/`,
      `${waferCustomUnitsBase}/shiny-drum-machine/`,
      `${waferUnitsBase}/sirius/`,
      `${waferUnitsBase}/luna/`,
      `${waferUnitsBase}/altair-xm/`,

      `${waferCustomUnitsBase}/webaudio-spectrum/`,
      `${waferCustomUnitsBase}/web-audio-mixer/`,
      `${waferCustomUnitsBase}/vue-audio-mixer/`,

      `${waferUnitsBase}/sunset-chorus-mini/`,
      `${waferUnitsBase}/lofi2/`,
      `${waferCustomUnitsBase}/darkwave/`,

      `${waferCustomUnitsBase}/react-synth/`,
      `${waferCustomUnitsBase}/poly-synth/`,
      `${waferCustomUnitsBase}/model-1/`,
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

      `file://${waferCustomUnitsLocalDir}/js/web-audio-mixer/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/vue-audio-mixer/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/beatmaker/`,
      `file://${waferUnitsLocalDistDir}/sunset-delay/`,
      `file://${waferUnitsLocalDistDir}/sunset-chorus-mini/`,
      `file://${waferUnitsLocalDistDir}/lofi2/`,
      `file://${waferCustomUnitsLocalDir}/js/darkwave/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/react-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/poly-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/model-1/`,
    ];
  }
}
