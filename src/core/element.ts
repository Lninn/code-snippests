import { isPointInRect } from "../utils"
import { createRectList, createSegmentList, Placement, Segment } from "./placement"
import { Point } from "./point"
import { Rect } from "./rect"
import { ElementShape } from "./ui"

export type RectProps = Pick<Rect, 'x' | 'y' | 'width' | 'height'> & { placement: Placement }

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

    const rect = this.getRect();

    this.pathList = createRectList(
      this.getCenter(),
      rect,
    )
    this.segmentList = createSegmentList(
      rect
    )
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
