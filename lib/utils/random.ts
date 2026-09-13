// Deterministic seeded RNG so the demo dataset is stable across server
// restarts and internally consistent (same seed -> same numbers every time).
export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

export class Rng {
  private fn: () => number;
  constructor(seed: number | string) {
    this.fn = mulberry32(typeof seed === "string" ? hashSeed(seed) : seed);
  }
  next(): number {
    return this.fn();
  }
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  float(min: number, max: number, decimals = 2): number {
    const v = this.next() * (max - min) + min;
    return Math.round(v * 10 ** decimals) / 10 ** decimals;
  }
  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }
  pickMany<T>(arr: T[], n: number): T[] {
    const copy = [...arr];
    const out: T[] = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
      const idx = this.int(0, copy.length - 1);
      out.push(copy[idx]);
      copy.splice(idx, 1);
    }
    return out;
  }
  bool(p = 0.5): boolean {
    return this.next() < p;
  }
}
