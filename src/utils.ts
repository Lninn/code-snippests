import { Element, Circle, Point, Rect } from "./element"

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

export const drawGuideLine = (ctx: CanvasRenderingContext2D, point: Point) => {
  const {
    canvas: {
      width,
      height,
    }
  } = ctx

  ctx.beginPath()
  ctx.moveTo(
    0,
    point.y,
  )
  ctx.lineTo(
    width,
    point.y,
  )
  ctx.closePath()
  
  ctx.strokeStyle = 'blue'
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(
    point.x,
    0,
  )
  ctx.lineTo(
    point.x,
    height,
  )
  ctx.closePath()

  ctx.strokeStyle = 'blue'
  ctx.stroke()
}

export const drawBg = (ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas
  const { width, height } = canvas

  ctx.fillStyle = '#e5e5e5'
  ctx.rect(0, 0, width, height)
  ctx.fill()
}

export const isPointInElement = (point: Point, e: Element) => {
  if (e.isCircle()) {
    return isPointInCircle(point, e as Circle)
  } else {
    return isPointInRect(point, e as Rect)
  }
}

const isPointInCircle = (
  point: Point,
  circle: Circle,
) => {
  const center: Point = {
    x: circle.x,
    y: circle.y,
  }
  const d = getDistance(point, center)

  return d <= circle.radius
}

const isPointInRect = (
  point: Point,
  rect: Rect,
) => {
  return (
    point.x >= rect.x && point.x <= rect.x + rect.width &&
    point.y >= rect.y && point.y <= rect.y + rect.height
  )
}

export const getMousePoint = (evt: MouseEvent) => {
  const { clientX, clientY } = evt

  const point: Point = {
    x: clientX,
    y: clientY,
  }

  return point
}
