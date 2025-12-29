// src/lib/real-estate/utils.ts

import { AREA_CODES_BY_STATE } from "./constant";

export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(array: readonly T[]): T {
    return array[this.range(0, array.length - 1)];
  }

  pickWeighted<T extends { weight: number }>(items: readonly T[]): T {
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let r = this.next() * total;
    for (const item of items) {
      if (r < item.weight) return item;
      r -= item.weight;
    }
    return items[0];
  }
}

export function generatePhone(stateCode: string): string {
  const areaCodes = AREA_CODES_BY_STATE[stateCode] || [
    Math.floor(Math.random() * 900) + 200,
  ];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const exchange = Math.floor(Math.random() * 900) + 200;
  const subscriber = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `(${areaCode}) ${exchange}-${subscriber}`;
}
