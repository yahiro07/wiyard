//color: #RGB or #RRGGBB
//spec: h[0~360] v[0~100] l[0~100] s[0~100] a[0~100] h[-360~+360] v/l/s[-100~+100]
//e.g. h180, h+90, v50, l50, s50, v+10, l+10, a80,
//example: colorMod('#445566', 'v50 s-10 a80')
//example: colorMod('#445566', 'l50 s-10 a80')
//example: colorMod('#ff0000', 'h120')
//output: #RRGGBBAA

type Op = {
  type: "h" | "v" | "l" | "s" | "a";
  relative: boolean;
  amount: number;
};
type ColorSpace = "hsv" | "hsl";

function parseColor(color: string): { r: number; g: number; b: number } {
  const hex = color.replace(/^#/, "");
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0]! + hex[0], 16),
      g: parseInt(hex[1]! + hex[1], 16),
      b: parseInt(hex[2]! + hex[2], 16),
    };
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }
  throw new Error(`Invalid color: ${color}`);
}

function parseSpec(spec: string): Op[] {
  const ops: Op[] = [];
  for (const token of spec.trim().split(/\s+/)) {
    if (!token) continue;
    const m = token.match(/^([vhlsa])([+-]?\d+)$/i);
    if (!m) continue;
    const type = m[1]!.toLowerCase() as Op["type"];
    const raw = m[2]!;
    const relative =
      type !== "a" && (raw.startsWith("+") || raw.startsWith("-"));
    ops.push({ type, relative, amount: parseInt(raw, 10) });
  }
  return ops;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function wrapHue(h: number): number {
  h %= 1;
  if (h < 0) h += 1;
  return h;
}

function applyHue(h: number, op: Op): number {
  if (op.relative) {
    const amount = Math.max(-360, Math.min(360, op.amount));
    return wrapHue(h + amount / 360);
  }
  const amount = Math.max(0, Math.min(360, op.amount));
  return wrapHue(amount / 360);
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [h, s, v];
}

function hsvToRgb(
  h: number,
  s: number,
  v: number,
): { r: number; g: number; b: number } {
  if (s === 0) {
    const n = Math.round(v * 255);
    return { r: n, g: n, b: n };
  }
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0;
  let g = 0;
  let b = 0;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  let s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [h, s, l];
}

function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  if (s === 0) {
    const n = Math.round(l * 255);
    return { r: n, g: n, b: n };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hueToRgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: Math.round(hueToRgb(h + 1 / 3) * 255),
    g: Math.round(hueToRgb(h) * 255),
    b: Math.round(hueToRgb(h - 1 / 3) * 255),
  };
}

function toPct255(n: number): number {
  return (n / 100) * 255;
}

function toHexByte(n: number): string {
  return Math.round(Math.max(0, Math.min(255, n)))
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
}

export function colorMod(color: string, spec: string = ""): string {
  let { r, g, b } = parseColor(color);
  let a = 255;
  let space: ColorSpace = "hsv";

  for (const op of parseSpec(spec)) {
    const delta = op.amount / 100;
    switch (op.type) {
      case "h": {
        if (space === "hsl") {
          let [h, s, l] = rgbToHsl(r, g, b);
          h = applyHue(h, op);
          ({ r, g, b } = hslToRgb(h, s, l));
        } else {
          let [h, s, v] = rgbToHsv(r, g, b);
          h = applyHue(h, op);
          ({ r, g, b } = hsvToRgb(h, s, v));
        }
        break;
      }
      case "v": {
        space = "hsv";
        let [h, s, v] = rgbToHsv(r, g, b);
        v = op.relative ? clamp01(v + delta) : clamp01(delta);
        ({ r, g, b } = hsvToRgb(h, s, v));
        break;
      }
      case "l": {
        space = "hsl";
        let [h, s, l] = rgbToHsl(r, g, b);
        l = op.relative ? clamp01(l + delta) : clamp01(delta);
        ({ r, g, b } = hslToRgb(h, s, l));
        break;
      }
      case "s": {
        if (space === "hsl") {
          let [h, s, l] = rgbToHsl(r, g, b);
          s = op.relative ? clamp01(s + delta) : clamp01(delta);
          ({ r, g, b } = hslToRgb(h, s, l));
        } else {
          let [h, s, v] = rgbToHsv(r, g, b);
          s = op.relative ? clamp01(s + delta) : clamp01(delta);
          ({ r, g, b } = hsvToRgb(h, s, v));
        }
        break;
      }
      case "a":
        a = toPct255(Math.max(0, Math.min(100, op.amount)));
        break;
    }
  }

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}${toHexByte(a)}`;
}
