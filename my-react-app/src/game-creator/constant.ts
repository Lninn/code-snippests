import { ElementKey, Point, Source } from "./type";

export const Config = {
  BlockSize: 30,

  BoardHeight: 600,
  BoardWidth: 300,

  BoardTop: 0,
  BoardBottom: 600 - 30,
};

export const metaSources: Record<ElementKey, Source> = {
  T: [
    [1, 1, 1],
    [0, 1],
  ],
  L: [[1], [1], [1, 1]],
  I: [[1], [1], [1], [1]],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
};

export const elementKeys = Object.keys(metaSources) as ElementKey[];

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomKey() {
  const index = randomIntFromInterval(0, elementKeys.length - 1);

  return elementKeys[index];
}
