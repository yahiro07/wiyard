function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

export function getUnitSourceUrls(debugUseLocalUnits?: boolean) {
  if (!debugUseLocalUnits) {
    const waferUnitsBase = `https://github.com/yahiro07/wafer-units/tree/r30`;
    const waferCustomUnitsBase = `https://github.com/yahiro07/wafer-custom-units/tree/r24`;

    return [
      `${waferUnitsBase}/graphite-drum-machine/`,
      `${waferUnitsBase}/techno-beat-machine/`,
      `${waferCustomUnitsBase}/js808/`,
      `${waferCustomUnitsBase}/shiny-drum-machine/`,
      `${waferUnitsBase}/bs03/`,

      `${waferCustomUnitsBase}/webaudio-tinysynth-mini/`,
      `${waferCustomUnitsBase}/super-oscillator/`,
      `${waferCustomUnitsBase}/midi-synth/`,
      `${waferCustomUnitsBase}/webaudio-synth-v2/`,
      `${waferCustomUnitsBase}/react-synth/`,
      `${waferCustomUnitsBase}/poly-synth/`,
      `${waferCustomUnitsBase}/model-1/`,
      `${waferCustomUnitsBase}/pg01web/`,

      `${waferUnitsBase}/sirius/`,
      `${waferUnitsBase}/orion/`,
      `${waferUnitsBase}/luna/`,
      `${waferUnitsBase}/altair-xm/`,
      `${waferUnitsBase}/radiant-rs/`,

      `${waferUnitsBase}/sunset-delay/`,
      `${waferUnitsBase}/sunset-chorus-mini/`,
      `${waferUnitsBase}/noise-mix/`,
      `${waferUnitsBase}/crusher/`,
      `${waferUnitsBase}/lofi2/`,
      `${waferUnitsBase}/csfx1/`,
      `${waferUnitsBase}/toner-3band-eq/`,
      `${waferUnitsBase}/toner-tilt-eq/`,
      `${waferUnitsBase}/toner-limiter/`,
      `${waferUnitsBase}/toner-compressor-lite/`,
      `${waferUnitsBase}/toner-saturation/`,
      `${waferUnitsBase}/toner-reverb/`,
      `${waferUnitsBase}/toner-panner/`,
      `${waferUnitsBase}/fc1/`,
      `${waferUnitsBase}/mz1/`,
      `${waferUnitsBase}/mz2/`,

      `${waferUnitsBase}/tonerio-sequencer/`,
      `${waferUnitsBase}/step-automator/`,
      `${waferUnitsBase}/waveform-checker/`,

      `${waferCustomUnitsBase}/sidechain-compressor/`,
      `${waferCustomUnitsBase}/web-audio-mixer/`,
      `${waferCustomUnitsBase}/vue-audio-mixer/`,
      `${waferUnitsBase}/nv1/`,
      `${waferUnitsBase}/horizon/`,
      `${waferUnitsBase}/recorder/`,
    ];
  } else {
    const waferUnitsLocalDistDir = toAbsolutePath("../../wafer-units/dist");
    const waferCustomUnitsLocalDir = toAbsolutePath("../../wafer-custom-units");
    return [
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
      `file://${waferUnitsLocalDistDir}/radiant-rs/`,

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

      `file://${waferUnitsLocalDistDir}/csfx1/`,
      `file://${waferUnitsLocalDistDir}/fc1/`,
      `file://${waferUnitsLocalDistDir}/mz1/`,
      `file://${waferUnitsLocalDistDir}/mz2/`,
      `file://${waferUnitsLocalDistDir}/noise-mix/`,
      `file://${waferUnitsLocalDistDir}/crusher/`,
      `file://${waferUnitsLocalDistDir}/toner-compressor-lite/`,
      `file://${waferUnitsLocalDistDir}/toner-panner/`,
      `file://${waferUnitsLocalDistDir}/toner-tilt-eq/`,
      `file://${waferUnitsLocalDistDir}/toner-3band-eq/`,
      `file://${waferUnitsLocalDistDir}/toner-reverb/`,
      `file://${waferUnitsLocalDistDir}/toner-limiter/`,
      `file://${waferUnitsLocalDistDir}/toner-saturation/`,

      // `file://${waferCustomUnitsLocalDir}/js/circular-audio-wave/`,
      // `file://${waferCustomUnitsLocalDir}/js/vissonance/`,
      // `file://${waferCustomUnitsLocalDir}/ts/dist/threejs-audio-reactive-visual/`,
      // `file://${waferCustomUnitsLocalDir}/js/audio-input-effects/`,
      `file://${waferUnitsLocalDistDir}/step-automator/`,
      // `file://${waferUnitsLocalDistDir}/tone-wheel/`,
      `file://${waferUnitsLocalDistDir}/nv1/`,
      `file://${waferUnitsLocalDistDir}/horizon/`,

      `file://${waferUnitsLocalDistDir}/recorder/`,
    ];
  }
}
