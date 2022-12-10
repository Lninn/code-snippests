import { Point } from "./point"
import { ElementShape } from "./ui"
import { getRandomColor } from "./utils"


export class Element {
  shape: ElementShape
  x: number
  y: number
  
  fillStyle: string
  offset: number = 0

  constructor(shape: ElementShape, x: number, y: number) {
    this.shape = shape
    this.x = x
    this.y = y

    this.fillStyle = getRandomColor()
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

  isCircle() {
    return this.shape === 'circle'
  }

  isRect() {
    return this.shape === 'rect'
  }

  createBox(_ctx: CanvasRenderingContext2D) {}
  createPath(_ctx: CanvasRenderingContext2D) {}

  updateSize(_downPoint: Point, _movePoint: Point) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    this.createPath(ctx)
    ctx.closePath()

    ctx.fillStyle = this.fillStyle
    ctx.fill()

    ctx.save()
    this.createBox(ctx)
    ctx.lineWidth = 3
    ctx.setLineDash([4, 2]);
    ctx.lineDashOffset = -this.offset;
    ctx.strokeStyle = 'red'
    ctx.stroke()
    ctx.restore()
  }
}
