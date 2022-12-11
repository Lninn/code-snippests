import { Element } from './element'
import { Point } from './point'
import { getRandomColor } from '../utils';

export class Text extends Element {
  fillStyle: string

  number: number = 0
  visible: boolean = true

  text: string = ''

  constructor(point: Point) {
    super('text', point.x, point.y)

    this.fillStyle = getRandomColor()
  }

  append(text: string) {
    this.text = `${this.text}${text}`
  }

  update() {
    this.number += 1

    if (this.number > 20) {
      this.number = 0
      this.visible = !this.visible
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.text) {
      ctx.font = "48px serif"
      ctx.fillStyle = this.fillStyle
      ctx.fillText(this.text, this.x, this.y + 30)
      return
    }

    if (this.visible) {
      ctx.beginPath()
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x, this.y + 30)
      ctx.closePath()
      ctx.lineWidth = 0.5
      ctx.strokeStyle = 'black'
      ctx.stroke()
    }

  }
}
