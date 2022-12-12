import { Element } from "./element"
import { Point } from "./point"
import { getDistance } from "../utils"

export class Circle extends Element {
  radius: number

  constructor(
    x: number,
    y: number,
    radius: number,
    fillStyle: string
  ) {
    super('circle', x, y, fillStyle)
    this.radius = radius
  }

  move(point: Point) {
    this.x = point.x
    this.y = point.y
  }

  updateSize(downPoint: Point, movePoint: Point) {
    const d = getDistance(downPoint, movePoint)

    this.radius = d
  }

  getCenter(): Point {
    return {
      x: this.x,
      y: this.y,
    }
  }

  getRect () {
    const t = this.y - this.radius
    const r = this.x + this.radius
    const b = this.y + this.radius
    const l = this.x - this.radius

    return {
      top: t,
      right: r,
      bottom: b,
      left: l,
    }
  }

  createPath(ctx: CanvasRenderingContext2D) {
    const { x, y, radius } = this

    ctx.beginPath()
    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2,
      false,
    )
    ctx.closePath()
  }
}
