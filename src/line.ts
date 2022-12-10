import { Point } from "./element"
import { getRandomColor } from "./utils"

export class Line {
  start: Point
  end: Point

  fillStyle: string

  constructor(start: Point, end: Point) {
    this.start = start
    this.end = end

    this.fillStyle = getRandomColor()
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.closePath()

    ctx.strokeStyle = this.fillStyle
    ctx.stroke()
  }
}
