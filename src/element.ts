import { ElementShape } from "./ui"
import { getRandomColor } from "./utils"

export interface Point {
  x: number
  y: number
}

export class Element {
  shape: ElementShape
  x: number
  y: number
  
  fillStyle: string

  constructor(shape: ElementShape, x: number, y: number) {
    this.shape = shape
    this.x = x
    this.y = y

    this.fillStyle = getRandomColor()
  }

  isCircle() {
    return this.shape === 'circle'
  }

  isRect() {
    return this.shape === 'rect'
  }

  parseElementSize() {
    throw new Error('need implement')
  }

  updatePoint(point: Point) {
    throw new Error('need implement')
  }

  updateSize(downPoint: Point, movePoint: Point) {
    throw new Error('need implement')
  }

  draw(ctx: CanvasRenderingContext2D) {
    throw new Error('need implement')
  }
}
