import { ElementKey, Source } from "./type";

export const Config = {
  BlockSize: 30,
  BoardHeight: 300,
  BoardWidth: 300,
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

export const InitialElementKey = elementKeys[0];
