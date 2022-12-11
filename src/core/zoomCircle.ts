import { getRandomColor, getRandomIntInclusive } from "../utils"

export class Foo {
  x: number = 0
  y: number = 0
  r: number = 0

  MAX_RADIUS: number = 100

  fillStyle: string

  ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx

    this.reset()
    this.fillStyle = getRandomColor()
  }

  reset() {
    const  {
      canvas: {
        width,
        height,
      }
    } = this.ctx

    this.x = getRandomIntInclusive(0, width - this.MAX_RADIUS)
    this.y = getRandomIntInclusive(0, height - this.MAX_RADIUS)
    this.r = 0
  }

  update() {
    this.r += 1

    if (this.r > this.MAX_RADIUS) {
     this.reset()
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(
      this.x,
      this.y,
      this.r,
      0,
      Math.PI * 2,
      false,
    )
    ctx.closePath()

    ctx.fillStyle = this.fillStyle
    ctx.fill()
  }
}
