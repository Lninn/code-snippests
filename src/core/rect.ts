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

  updateSize(downPoint: Point, movePoint: Point) {

    const width = movePoint.x - downPoint.x
    const xAxis = width < 0
    
    if (xAxis) {
      this.x = movePoint.x
    }
    this.width = Math.abs(width)
    
    const height = movePoint.y - downPoint.y
    const yAxis = height < 0

    if (yAxis) {
      this.y = movePoint.y
    }
    this.height = Math.abs(height)

  }

  getCenter(): Point {
    return {
      x: (this.x + this.width / 2),
      y: (this.y + this.height / 2),
    }
  }

  getRect() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    }
  }

  createPath(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height } = this

    ctx.rect(x, y, width, height)
  }
  
}
