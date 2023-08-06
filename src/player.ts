import { Cell, createCells, drawCell, rotateMatrix } from "./config"


type Key = 't' | 'o' | 'i' | 'l'
const shapeMap: Record<Key, number[][]> = {
  o: [
    [1, 1],
    [1, 1],
  ],
  t: [
    [1, 1, 1],
    [0, 1],
  ],
  i: [
    [1, 1, 1, 1]
  ],
  l: [
    [1, 0, 0],
    [1, 1, 1],
  ]
}
const keys = Object.keys(shapeMap)
const getShape = () => {
  const i = getRandomInt(0, keys.length - 1)
  const key = keys[i] as Key

  return shapeMap[key]
}

export class Player {
  private ctx: CanvasRenderingContext2D
  
  public x!: number
  public y!: number
  public shape!: number[][]
  private cells!: Cell[]
 
  private initValues: {
    x: number,
    y: number,
    size: number
  }
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    this.initValues = {
      x,
      y,
      size
    }
    this.ctx = ctx
   
    this.init(x, y, size)
  }

  public getNextCellsByStep(step: -1 | 1) {
    const nextCells = this.cells.map(c => {
      return {
        ...c,
        x: c.x + step
      }
    })

    return nextCells
  }

  public updateByY(y: number, cells: Cell[]) {
    this.y = y
    this.cells = cells
  }

  public updateByStep(step: -1 | 1, cells: Cell[]) {
    this.x = this.x + step
    this.cells = cells
  }

  public updateByShape(shape: number[][], cells: Cell[]) {
    this.shape = shape
    this.cells = cells
  }

  public reset() {
    const { x, y, size } = this.initValues
    this.init(x, y, size)
  }

  public isCellActive(acCell: Cell) {
    return this.cells.some(cell => {
      return cell.x === acCell.x && cell.y === acCell.y
    })
  }

  public draw() {
    for (const cell of this.cells) {
      drawCell(this.ctx, cell, undefined, 'blue')
    }
  }

  private init(x: number, y: number, size: number) {
    this.shape = rotateMatrix(getShape())
    this.x = x - Math.floor(this.shape.length / 2)
    this.y = y
    this.cells = createCells(this.shape, this.x, this.y, size)
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
