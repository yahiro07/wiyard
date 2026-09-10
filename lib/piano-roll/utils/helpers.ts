export function seqNumbers(n: number): number[] {
  return new Array(n).fill(0).map((_, i) => i);
}

export function iife<T>(fn: () => T): T {
  return fn();
}

export function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function linearInterpolate(
  value: number,
  s0: number,
  s1: number,
  d0: number,
  d1: number,
  clamp?: boolean,
) {
  if (s1 === s0) return d0;
  const v = ((value - s0) / (s1 - s0)) * (d1 - d0) + d0;
  if (clamp) {
    const lo = Math.min(d0, d1);
    const hi = Math.max(d0, d1);
    return clampValue(v, lo, hi);
  }
  return v;
}

export function unaryToByte(value: number): number {
  return (value * 255) >>> 0;
}

export function unaryFromByte(byte: number): number {
  return byte / 255;
}

export function npx(value: number) {
  return `${value}px`;
}
