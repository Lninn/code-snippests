import { Point } from "./element"
import { Line } from "./line"

export class Grid {
  width: number
  height: number
  rowSpan: number
  colSpan: number

  lineWidth: number = 1

  gridX: Line[] = []
  gridY: Line[] = []

  constructor(ctx: CanvasRenderingContext2D, rowSpan: number, colSpan: number) {
    const {
      canvas: { 
        width,
        height
      }
    } = ctx

    this.width = width
    this.height = height
    this.rowSpan = rowSpan
    this.colSpan = colSpan

    this.createX()
    this.createY()
  }

  createX() {
    const gap = this.lineWidth / 2

    const span = this.rowSpan
    const size = this.width - gap * 2

    const rowSize = (size / span)
    const grid: Line[] = []

    let i = 0;
    for (; i <= span; i++) {
      const start: Point = {
        x: rowSize * i + gap,
        y: 0,
      }

      const end: Point = {
        x: rowSize * i + gap,
        y: this.height,
      }

      const line = new Line(start, end)
      grid.push(line)
    }

    this.gridX = grid
  }

  createY() {
    const gap = this.lineWidth / 2

    const span = this.colSpan
    const size = this.height - gap * 2

    const colSize = (size / span)
    const grid: Line[] = []

    let i = 0;
    for (; i <= span; i++) {
      const start: Point = {
        x: 0,
        y: colSize * i + gap,
      }

      const end: Point = {
        x: this.width,
        y: colSize * i + gap,
      }

      const line = new Line(start, end)
      grid.push(line)
    }

    this.gridY = grid
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const line of [...this.gridX, ...this.gridY]) {
      ctx.lineWidth = this.lineWidth
      
      line.draw(ctx)
    }
  }
}
