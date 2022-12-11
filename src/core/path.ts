import { Point } from "./point"
import { Element } from './element'


export class Path extends Element {
  points: Point[] = []

  constructor(point: Point) {
    super('path', point.x, point.y)
  }

  append(point: Point) {
    this.points.push(point)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const points = this.points

    ctx.beginPath()

    ctx.lineWidth = 10
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#c0392b'
  
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        const first = points[i]
        ctx.moveTo(first.x, first.y)
      } else {
        const current = points[i]
        ctx.lineTo(current.x, current.y)
      }
  
      i++
    }
  
    ctx.stroke()
  }

}
