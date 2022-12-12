import { RectProps } from "./circle"
import { Line } from "./line"
import { Point } from "./point"
import { ElementShape } from "./ui"


export interface CornerProps {
  top: number
  right: number
  bottom: number
  left: number
}

export class Element {
  shape: ElementShape
  x: number
  y: number

  fillStyle: string
  offset: number = 0

  isSelect: boolean = false

  constructor(shape: ElementShape, x: number, y: number, fillStyle: string) {
    this.shape = shape
    this.x = x
    this.y = y

    this.fillStyle = fillStyle
  }

  update() {
    this.offset++
    if (this.offset > 16) {
      this.offset = 0
    }
  }

  move(point: Point) {
    this.x = point.x
    this.y = point.y
  }

  isPath() {
    return this.shape === 'path'
  }

  isCircle() {
    return this.shape === 'circle'
  }

  isRect() {
    return this.shape === 'rect'
  }

  getCenter(): Point {
    return {
      x: 0,
      y: 0,
    }
  }

  getRect(): CornerProps {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
  }

  createPath(_ctx: CanvasRenderingContext2D) {}

  createRect(
    t: number,
    r: number,
    b: number,
    l: number,
  ) {

    const { x, y } = this.getCenter()

    const gap = 5
    const rectSize = gap * 2

    const pathList: RectProps[] = [
      {
        x: l - rectSize,
        y: t - rectSize,
        width: rectSize,
        height: rectSize,
      },
      {
        x: x - gap,
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
        y: y - gap,
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
        x: x - gap,
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
        y: y - gap,
        width: rectSize,
        height: rectSize,
      }
    ]

    const lineList: Pick<Line, 'start' | 'end'>[] = [
      {
        start: { x: l, y: t - gap },
        end: { x: r, y: t - gap },
      },
      {
        start: { x: r + gap, y: t },
        end: { x: r + gap, y: b },
      },
      {
        start: { x: l, y: b + gap },
        end: { x: r, y: b + gap },
      },
      {
        start: { x: l - gap, y: t },
        end: { x: l - gap, y: b },
      },
    ]

    return {
      pathList,
      lineList,
    }
  }

  drawLineList(
    ctx: CanvasRenderingContext2D,
    lineList: Pick<Line, 'start' | 'end'>[],
  ) {
    ctx.beginPath()

    for (const line of lineList) {
      const { start, end } = line

      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
    }

    ctx.closePath()
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

  updateSize(_downPoint: Point, _movePoint: Point) {}

  drawBorder(ctx: CanvasRenderingContext2D) {

    ctx.save()

    const rect = this.getRect()
    const {
      pathList,
      lineList,
    } = this.createRect(
      rect.top,
      rect.right,
      rect.bottom,
      rect.left,
    )

    for (const box of pathList) {
      this.drawRect(ctx, box)
    }

    this.drawLineList(ctx, lineList)

    ctx.lineWidth = 1
    ctx.setLineDash([4, 2]);
    ctx.lineDashOffset = -this.offset;
    ctx.strokeStyle = this.fillStyle
    ctx.stroke()

    ctx.restore()
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    this.createPath(ctx)
    ctx.closePath()

    ctx.strokeStyle = this.fillStyle
    ctx.stroke()

    if (!this.isSelect) {
      return
    }

    this.drawBorder(ctx)
  }
}
