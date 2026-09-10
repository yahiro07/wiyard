import { colorMod } from "../utils/color-mod";

export const uiColors = {
  clPanelBody: colorMod("#445", "h220"),
  clPianoRollBg: colorMod("#334", "h205"),
  clPianoRollBgBlackKey: colorMod("#334", "h205 v-2"),
  clNoteBg: "#6cc",
};

export const uiColorsCssVarsStyle = {
  "--cl-panel-body": uiColors.clPanelBody,
  "--cl-piano-roll-bg": uiColors.clPianoRollBg,
  "--cl-piano-roll-bg-black-key": uiColors.clPianoRollBgBlackKey,
  "--cl-note-bg": uiColors.clNoteBg,
} as React.CSSProperties;
