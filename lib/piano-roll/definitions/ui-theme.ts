import { colorMod } from "../utils/color-mod";

export const uiColors = {
  clPanelBody: colorMod("#445", "h220"),
  clPianoRollBg: colorMod("#334", "h220"),
  clPianoRollBgBlackKey: colorMod("#334", "h220 v-2"),
  clPatternGridBg: colorMod("#334", "h220"),
  clPatternGridBgPrimary: colorMod("#334", "h220 v-2"),
};

export const uiColorsCssVarsStyle = {
  "--cl-panel-body": uiColors.clPanelBody,
  "--cl-piano-roll-bg": uiColors.clPianoRollBg,
  "--cl-piano-roll-bg-black-key": uiColors.clPianoRollBgBlackKey,
} as React.CSSProperties;
