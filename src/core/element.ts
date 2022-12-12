import { ELEMENT_BOX_SIZE } from "../config"
import { isPointInRect } from "../utils"
import { Line } from "./line"
import { Point } from "./point"
import { Rect } from "./rect"
import { ElementShape } from "./ui"

export type RectProps = Pick<Rect, 'x' | 'y' | 'width' | 'height'>

export type Segment = [Point, Point]

const enum Placement {
  TopLeft,
  Top,
  TopRight,

  RightTop,
  Right,
  RightBottom,

  BottomRight,
  Bottom,
  BottomLeft,

  LeftTop,
  Left,
  LeftBottom,
}

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

  segmentList: Segment[] | null = null
  pathList: RectProps[] | null = null

  placement: Placement | null = null

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

    this.updateRectShape()
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

  isPointInResizeBox(point: Point) {
    if (!this.pathList) {
      return false
    }

    for (const rect of this.pathList) {
      if (isPointInRect(point, rect as Rect)) {
        return true
      }
    }

    return false
  }

  createPath(_ctx: CanvasRenderingContext2D) {}

  updateRectShape() {

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
    pathList = [left - rectSize, center.x - gap, right].reduce(
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

    const segmentList: Segment[] = []
    for (let i = 0; i < lineList.length; i++) {
      const {
        start,
        end,
      } = lineList[i]

      const createCenterSegment = () => {
        if (i % 2 === 0) {
          const width = right - left
          const interval = width / 2 - gap
          const c1: Point = { x: start.x + interval, y: start.y }
          const c2: Point = { x: end.x - interval, y: start.y }

          return [c1, c2]
        } else {
          const height = bottom - top
          const interval = height / 2 - gap
          const c1: Point = { x: start.x, y: start.y + interval }
          const c2: Point = { x: start.x, y: end.y - interval }

          return [c1, c2]
        }
      }

      const [c1, c2] = createCenterSegment()

      const prev: Segment = [start, c1]
      const next: Segment = [c2, end]

      segmentList.push(prev)
      segmentList.push(next)
    }

    this.pathList = pathList
    this.segmentList = segmentList
  }

  drawLineList(
    ctx: CanvasRenderingContext2D,
    lineList: Segment[],
  ) {
    ctx.beginPath()

    for (const line of lineList) {
      const [start, end] = line

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

    if (this.pathList) {
      for (const box of this.pathList) {
        this.drawRect(ctx, box)
      }
    }

    if (this.segmentList) {
      this.drawLineList(ctx, this.segmentList)
    }
    
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
