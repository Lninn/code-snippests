export class App {
  public paused: boolean

  constructor() {
    this.paused = false
  }
}

export interface Cell {
  x: number
  y: number
  s: number
  status: 0 | 1
}

export function drawCell(ctx: CanvasRenderingContext2D, cell: Cell, strokeStyle?: string, fillStyle?: string) {
  const [
    left,
    top
  ] = [cell.x * cell.s, cell.y * cell.s]

  ctx.beginPath()
  ctx.rect(
    left,
    top,
    cell.s,
    cell.s
  )

  if (strokeStyle) {
    const _s = ctx.strokeStyle
    ctx.strokeStyle = strokeStyle
    ctx.stroke()
    ctx.strokeStyle = _s
  }

  if (fillStyle) {
    const _f = ctx.fillStyle
    ctx.fillStyle = fillStyle
    ctx.fill()
    ctx.fillStyle = _f
  }
}

export function createCells(shape: number[][], startX: number, startY: number, size: number) {
  const cells: Cell[] = []

  for (let y = 0; y < shape.length; y++) {
    const sub = shape[y]
    for (let x = 0; x < sub.length; x++) {
      const no = sub[x]

      if (no) {
        const cell: Cell = {
          x: startX + x,
          y: startY + y,
          s: size,
          status: 0,
        }
        cells.push(cell)
      }
     
    }
  }

  return cells
}

export function rotateMatrix(m: number[][]) {
  const row = m.length
  const col = Math.max(...m.map(x => x.length))

  const newM: number[][]= []
  for (let i = 0; i < col; i++) {
    newM[i] = []
    for (let j = 0; j < row; j++) {
      newM[i][j] = m[row - j - 1][i]
    }
  }

  return newM
}
