export function seqNumbers(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
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

export function mapUnaryTo(value: number, d0: number, d1: number) {
  return d0 + (d1 - d0) * value;
}

export function mapUnaryFrom(
  val: number,
  lo: number,
  hi: number,
  clamp?: boolean,
) {
  if (hi === lo) return lo;
  const v = (val - lo) / (hi - lo);
  if (clamp) {
    return clampValue(v, 0, 1);
  }
  return v;
}

export function bottomLimit(value: number, limit: number) {
  return Math.max(value, limit);
}

export function topLimit(value: number, limit: number) {
  return Math.min(value, limit);
}

export function safeParseInt(text: string, defaultValue: number) {
  const res = parseInt(text, 10);
  return Number.isFinite(res) ? res : defaultValue;
}

export function inBetween(value: number, min: number, max: number) {
  return min <= value && value <= max;
}

export function roundFloat(value: number, fracDigits: number = 0) {
  const k = 10 ** fracDigits;
  return Math.round(value * k) / k;
}
