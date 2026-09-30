function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

export function getUnitSourceUrls(debugUseLocalUnits?: boolean) {
  if (!debugUseLocalUnits) {
    const waferUnitsBase = `https://github.com/yahiro07/wafer-units/tree/r26`;
    const waferCustomUnitsBase = `https://github.com/yahiro07/wafer-custom-units/tree/r21`;

    return [
      `${waferUnitsBase}/fluorite-piano-roll/`,
      //
      `${waferUnitsBase}/graphite-drum-machine/`,

      `${waferCustomUnitsBase}/js808/`,
      `${waferCustomUnitsBase}/webaudio-tinysynth-mini/`,
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

      `${waferUnitsBase}/sunset-delay/`,
      `${waferUnitsBase}/sunset-chorus-mini/`,
      `${waferUnitsBase}/lofi2/`,

      `${waferCustomUnitsBase}/react-synth/`,
      `${waferCustomUnitsBase}/poly-synth/`,
      `${waferCustomUnitsBase}/model-1/`,
    ];
  } else {
    const waferUnitsLocalDistDir = toAbsolutePath("../../wafer-units/dist");
    const waferCustomUnitsLocalDir = toAbsolutePath("../../wafer-custom-units");
    return [
      `file://${waferUnitsLocalDistDir}/fluorite-piano-roll/`,
      //
      `file://${waferUnitsLocalDistDir}/graphite-drum-machine/`,
      `file://${waferUnitsLocalDistDir}/techno-beat-machine/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/js808/`,
      `file://${waferCustomUnitsLocalDir}/js/shiny-drum-machine/`,
      `file://${waferUnitsLocalDistDir}/bs03/`,

      `file://${waferCustomUnitsLocalDir}/js/webaudio-tinysynth-mini/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/super-oscillator/`,
      `file://${waferCustomUnitsLocalDir}/js/midi-synth/`,
      `file://${waferCustomUnitsLocalDir}/js/webaudio-synth-v2/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/react-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/poly-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/model-1/`,
      `file://${waferCustomUnitsLocalDir}/js/pg01web/`,

      `file://${waferUnitsLocalDistDir}/sirius/`,
      `file://${waferUnitsLocalDistDir}/luna/`,
      `file://${waferUnitsLocalDistDir}/altair-xm/`,

      `file://${waferUnitsLocalDistDir}/step-automator/`,

      `file://${waferUnitsLocalDistDir}/toner-compressor/`,
      `file://${waferUnitsLocalDistDir}/sunset-delay/`,
      `file://${waferUnitsLocalDistDir}/sunset-chorus-mini/`,
      `file://${waferUnitsLocalDistDir}/lofi2/`,

      `file://${waferCustomUnitsLocalDir}/js/web-audio-mixer/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/vue-audio-mixer/`,
      // `file://${waferCustomUnitsLocalDir}/webaudio-spectrum/`,
      `file://${waferUnitsLocalDistDir}/waveform-checker/`,

      `file://${waferUnitsLocalDistDir}/bseq2/`,
      `file://${waferUnitsLocalDistDir}/tonerio-sequencer/`,
      `file://${waferUnitsLocalDistDir}/vsc1/`,
      `file://${waferUnitsLocalDistDir}/orion/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/sidechain-compressor/`,

      `file://${waferUnitsLocalDistDir}/channel-strip/`,
      `file://${waferUnitsLocalDistDir}/fc1/`,
      `file://${waferUnitsLocalDistDir}/mz1/`,
      `file://${waferUnitsLocalDistDir}/mz2/`,
      `file://${waferUnitsLocalDistDir}/noise-mix/`,
      `file://${waferUnitsLocalDistDir}/crusher/`,
      // `file://${waferUnitsLocalDistDir}/toner-compressor/`,
      // `file://${waferUnitsLocalDistDir}/toner-panner/`,
      `file://${waferUnitsLocalDistDir}/toner-tilt-eq/`,
      `file://${waferUnitsLocalDistDir}/toner-3band-eq/`,
      `file://${waferUnitsLocalDistDir}/toner-reverb/`,
      `file://${waferUnitsLocalDistDir}/toner-limiter/`,
      `file://${waferUnitsLocalDistDir}/toner-saturation/`,

      `file://${waferCustomUnitsLocalDir}/js/circular-audio-wave/`,
      `file://${waferCustomUnitsLocalDir}/js/vissonance/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/threejs-audio-reactive-visual/`,
      `file://${waferCustomUnitsLocalDir}/js/audio-input-effects/`,
      `file://${waferUnitsLocalDistDir}/tone-wheel/`,
    ];
  }
}
