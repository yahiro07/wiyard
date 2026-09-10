import { colorMod } from "../utils/color-mod";

const uiColors = {
  clPanelBody: colorMod("#445", "h220"),
  clPianoRollBg: colorMod("#334", "h205"),
  clPianoRollBgBlackKey: colorMod("#334", "h205 v-2"),
  clGridWeak2: "#0002",
  clGridWeak: "#0004",
  clGridStrong: "#0006",
  clGridStrong2: "#000a",
  clNoteBg: "#6cc",
};

export const uiColorsCssVarsStyle = {
  "--cl-panel-body": uiColors.clPanelBody,
  "--cl-piano-roll-bg": uiColors.clPianoRollBg,
  "--cl-piano-roll-bg-black-key": uiColors.clPianoRollBgBlackKey,
  "--cl-grid-weak-2": uiColors.clGridWeak2,
  "--cl-grid-weak": uiColors.clGridWeak,
  "--cl-grid-strong": uiColors.clGridStrong,
  "--cl-grid-strong-2": uiColors.clGridStrong2,
  "--cl-note-bg": uiColors.clNoteBg,
} as React.CSSProperties;
