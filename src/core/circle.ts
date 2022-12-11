import { Element } from "./element"
import { Point } from "./point"
import { Rect } from "./rect"
import { getDistance } from "./utils"


type RectProps = Pick<Rect, 'x' | 'y' | 'width' | 'height'>

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
    box: RectProps
  ) {
    ctx.beginPath()
    ctx.rect(
      box.x,
      box.y,
      box.width,
      box.height,
    )
    ctx.closePath()

    ctx.strokeStyle = this.fillStyle
    ctx.stroke()
  }

  createBox(ctx: CanvasRenderingContext2D) {
    const gap = 5
    const rectSize = gap * 2

    const t = this.y - this.radius
    const r = this.x + this.radius
    const b = this.y + this.radius
    const l = this.x - this.radius

    const boxList: RectProps[] = [
      {
        x: l - rectSize,
        y: t - rectSize,
        width: rectSize,
        height: rectSize,
      },
      {
        x: this.x - gap,
        y: t - rectSize,
        width: rectSize,
        height: rectSize,
      },
      {
        x: r,
        y: t - rectSize,
        width: rectSize,
        height: rectSize,
      },
      {
        x: r,
        y: this.y - gap,
        width: rectSize,
        height: rectSize,
      },
      {
        x: r,
        y: b,
        width: rectSize,
        height: rectSize,
      },
      {
        x: this.x - gap,
        y: b,
        width: rectSize,
        height: rectSize,
      },
      {
        x: l - rectSize,
        y: b,
        width: rectSize,
        height: rectSize,
      },
      {
        x: l - rectSize,
        y: this.y - gap,
        width: rectSize,
        height: rectSize,
      }
    ]

    for (const box of boxList) {
      this.drawRect(ctx, box)
    }

    ctx.beginPath()
    ctx.moveTo(l, t - gap)
    ctx.lineTo(r, t - gap)

    ctx.moveTo(r + gap, t)
    ctx.lineTo(r + gap, b)

    ctx.moveTo(l, b + gap)
    ctx.lineTo(r, b + gap)

    ctx.moveTo(l - gap, t)
    ctx.lineTo(l - gap, b)

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
