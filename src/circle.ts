import { Element } from "./element"
import { Point } from "./point"
import { getDistance } from "./utils"

export class Circle extends Element {
  radius: number

  constructor(x: number, y: number, radius: number) {
    super('circle', x, y)
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

  createBox(ctx: CanvasRenderingContext2D) {
    const gap = 10

    ctx.beginPath()
    ctx.rect(
      this.x - gap,
      this.y - gap,
      this.radius * 2 - gap * 2,
      this.radius * 2 - gap * 2,
    )
    ctx.closePath()
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
