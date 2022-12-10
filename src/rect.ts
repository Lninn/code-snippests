import { Element, Point } from "./element"

export class Rect extends Element {
  width: number
  height: number

  constructor(x: number, y: number, width: number, height: number) {
    super('rect', x, y)
    this.width = width
    this.height = height
  }

  parseElementSize() {
    // 当前的 element 的宽度和高度转换成正数

    const xAxis = this.width < 0
    const yAxis = this.height < 0

    if (xAxis) {
      this.width = Math.abs(this.width)
      this.x -= this.width
    }

    if (yAxis) {
      this.height = Math.abs(this.height)
      this.y -= this.height
    }
  }

  updatePoint(point: Point) {
    this.x = point.x
    this.y = point.y
  }

  updateSize(downPoint: Point, movePoint: Point) {
    const width = movePoint.x - downPoint.x
    const height = movePoint.y - downPoint.y

    this.width = width
    this.height = height
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height } = this

    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.closePath()
   
    // ctx.strokeStyle = '#000'
    // ctx.stroke()

    ctx.fillStyle = this.fillStyle
    ctx.fill()
  }
}
