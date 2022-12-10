import { Element } from "./element"
import { Point } from "./point"

export class Rect extends Element {
  width: number
  height: number

  constructor(x: number, y: number, width: number, height: number) {
    super('rect', x, y)
    this.width = width
    this.height = height
  }

  transform() {
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

  updateSize(downPoint: Point, movePoint: Point) {
    const width = movePoint.x - downPoint.x
    const height = movePoint.y - downPoint.y

    this.width = width
    this.height = height
  }

  createPath(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height } = this

    ctx.rect(x, y, width, height)
  }
  
}
