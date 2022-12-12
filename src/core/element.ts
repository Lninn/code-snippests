import { ELEMENT_BOX_SIZE } from "../config"
import { Line } from "./line"
import { Point } from "./point"
import { Rect } from "./rect"
import { ElementShape } from "./ui"

export type RectProps = Pick<Rect, 'x' | 'y' | 'width' | 'height'>

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

  isSelect: boolean = false

  fillStyle: string
  offset: number = 0

  constructor(
    shape: ElementShape,
    x: number,
    y: number,
    fillStyle: string
  ) {
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

  createRect() {

    const gap = ELEMENT_BOX_SIZE
    const rectSize = gap * 2

    const center = this.getCenter()
    const { top, right, bottom, left } = this.getRect();
    
    let pathList: RectProps[] = [
      {
        x: left - rectSize,
        y: center.y - gap,
        width: rectSize,
        height: rectSize,
      },
      {
        x: right,
        y: center.y - gap,
        width: rectSize,
        height: rectSize,
      },
    ];
    pathList = [
      left - rectSize,
      center.x - gap,
      right,
    ].reduce(
      (accu, x: number) => {
        return [
          ...accu,
          { x, y: top -rectSize, width: rectSize, height: rectSize } as RectProps,
          { x, y: bottom, width: rectSize, height: rectSize } as RectProps,
        ]
      },
      pathList,
    )

    const lineList: Pick<Line, 'start' | 'end'>[] = [
      {
        start: { x: left, y: top - gap },
        end: { x: right, y: top - gap },
      },
      {
        start: { x: right + gap, y: top },
        end: { x: right + gap, y: bottom },
      },
      {
        start: { x: left, y: bottom + gap },
        end: { x: right, y: bottom + gap },
      },
      {
        start: { x: left - gap, y: top },
        end: { x: left - gap, y: bottom },
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

    const {
      pathList,
      lineList,
    } = this.createRect()

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
