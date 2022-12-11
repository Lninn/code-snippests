import { Point } from "./point"

export class Line {
  start: Point
  end: Point

  strokeStyle: string

  constructor(start: Point, end: Point, strokeStyle: string) {
    this.start = start
    this.end = end

    this.strokeStyle = strokeStyle
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.closePath()

    ctx.strokeStyle = this.strokeStyle
    ctx.stroke()
  }
}
