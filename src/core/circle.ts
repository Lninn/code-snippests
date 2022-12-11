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

  drawRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    ctx.beginPath()
    ctx.rect(
      x,
      y,
      w,
      h,
    )
    ctx.closePath()

    ctx.strokeStyle = this.fillStyle
    ctx.stroke()
  }

  createBox(ctx: CanvasRenderingContext2D) {
    const boxSize = 30

    const t = this.y - this.radius
    const r = this.x + this.radius
    const b = this.y + this.radius
    const l = this.x - this.radius

    this.drawRect(
      ctx,
      l - boxSize,
      t - boxSize - boxSize,
      boxSize * 2,
      boxSize * 2,
    )
    this.drawRect(
      ctx,
      r - boxSize,
      t - boxSize,
      boxSize * 2,
      boxSize * 2,
    )
    this.drawRect(
      ctx,
      r - boxSize,
      b - boxSize,
      boxSize * 2,
      boxSize * 2,
    )
    this.drawRect(
      ctx,
      l - boxSize,
      b - boxSize,
      boxSize * 2,
      boxSize * 2,
    )

    this.drawRect(
      ctx,
      this.x - boxSize,
      t - boxSize - boxSize,
      boxSize * 2,
      boxSize * 2,
    )

    this.drawRect(
      ctx,
      r - boxSize,
      this.y - boxSize,
      boxSize * 2,
      boxSize * 2,
    )

    this.drawRect(
      ctx,
      this.x - boxSize,
      b - boxSize,
      boxSize * 2,
      boxSize * 2,
    )

    this.drawRect(
      ctx,
      l - boxSize,
      this.y - boxSize,
      boxSize * 2,
      boxSize * 2,
    )

    ctx.beginPath()
    ctx.moveTo(l + boxSize, t - boxSize)
    ctx.lineTo(r - boxSize, t - boxSize)

    ctx.moveTo(r, t + boxSize)
    ctx.lineTo(r, b - boxSize)

    ctx.moveTo(l + boxSize, b)
    ctx.lineTo(r - boxSize, b)

    ctx.moveTo(l, t + boxSize)
    ctx.lineTo(l, b - boxSize)

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
