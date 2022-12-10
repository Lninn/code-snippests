import { Element } from "./element"
import { Point } from "./point"
import { getDistance } from "./utils"

export class Circle extends Element {
  radius: number

  constructor(x: number, y: number, radius: number) {
    super('circle', x, y)
    this.radius = radius
  }

  parseElementSize() {
    //
  }

  updatePoint(point: Point) {
    this.x = point.x
    this.y = point.y
  }

  updateSize(downPoint: Point, movePoint: Point) {
    const d = getDistance(downPoint, movePoint)

    this.radius = d
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, radius } = this

    ctx.beginPath()
    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2,
      false,
    )
    ctx.closePath()
    
    // ctx.strokeStyle = '#000'
    // ctx.stroke()

    ctx.fillStyle = this.fillStyle
    ctx.fill()
  }
}
