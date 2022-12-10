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

  createBox(ctx: CanvasRenderingContext2D) {
    const gap = 10

    ctx.beginPath()
    ctx.rect(
      this.x - gap,
      this.y - gap,
      this.width + gap * 2,
      this.height + gap * 2,
    )
    ctx.closePath()
  }

  createPath(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height } = this

    ctx.rect(x, y, width, height)
  }
  
}
