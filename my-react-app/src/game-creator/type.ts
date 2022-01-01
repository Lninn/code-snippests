export interface Point {
  x: number;
  y: number;
}

export interface Segment {
  start: Point;
  end: Point;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Source = number[][];

export type ElementKey = "T" | "L" | "I" | "S" | "Z" | "O";

export type Actions = {
  onPaused: () => void;
  move: () => void;
  onTransform: () => void;
  onPrint: () => void;
};
