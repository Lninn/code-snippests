import { Point } from "./element"

export const getDistance = (p1: Point, p2: Point) => {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}

export const getById = <T = HTMLDivElement>(id: string) => (
  document.getElementById(id) as T
)

export const createElement = (n: keyof HTMLElementTagNameMap) => {
  return document.createElement(n)
}

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
