import { Cell, drawCell } from "./config"
import { Player } from "./player"


export class Grid {
  private cells: Cell[]
  private rows: number
  private cols: number
  private padding: number

  constructor(
    rows: number,
    cols: number,
    padding: number,
    size: number
  ) {

    this.rows = rows
    this.cols = cols
    this.padding = padding

    const cells = createGrid(size, rows, cols, padding)
    this.cells = cells
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const cell of this.cells) {
      if (cell.status === 1) {
        drawCell(ctx, cell, 'blue', 'red')
      } else {
        drawCell(ctx, cell, '#072448', undefined)
      }
    }
  }

  public update(player: Player) {
    const activeCells = this.getAcitveCells(player)
    mutateCells(activeCells)

    const tagCells = this.getTagCells()
    const fullRowNos = getFullRowNos(
      tagCells,
      this.rows,
      this.padding,
      this.cols
    )
    
    if (fullRowNos.length) {
      this.clear(tagCells, fullRowNos)
    }
  }

  private clear(
    tagCells: Cell[],
    rowNos: number[]
  ) {
    const waitClearCells = getClearCells(tagCells, rowNos)

    let downCells: Cell[] = []
  
    for (const cell of waitClearCells) {
      if (!rowNos.includes(cell.y)) {
        downCells.push(cell)
      }
    }

    waitClearCells.forEach(c => c.status = 0)
  
    rowNos.forEach(() => {
      const nextCells = downCells.map(c => {
        return { ...c, y: c.y + 1 }
      })
  
      const actCells = findCells(
        this.cells,
        nextCells
      )
  
      downCells.forEach(c => c.status = 0)
      actCells.forEach(c => c.status = 1)
  
      downCells = actCells
    })
  }

  private getTagCells() {
    return this.cells.filter(c => c.status === 1)
  }

  public hasSomeCellActive(targetCells: Cell[]) {
    for (const targetCell of targetCells) {
      const eachCell = this.cells.find(cell => cell.x === targetCell.x && cell.y === targetCell.y)
      if (eachCell && eachCell.status === 1) return true
    }
  
    return false
  }

  public isInteract(nextCells: Cell[]) {
    const existCells = findCells(
      this.cells,
      nextCells,
    )
  
    return existCells.some(cell => cell.status === 1)
  }

  public getAcitveCells(player: Player) {
    const acCells: Cell[] = []

    for (const cell of this.cells) {
      if (player.isCellActive(cell)) {
        acCells.push(cell)
      }
    }
  
    return acCells
  }
}

function createGrid(size: number, rows: number, cols: number, padding: number) {
  const cellList: Cell[] = []

  // 横线
  let y = padding
  while(y < (rows - padding)) {

    // 竖线
    let x = padding
    while(x < (cols - padding)) {
      const cell: Cell = { x, y, s: size, status: 0 }
      cellList.push(cell)

      x++
    }

    y++
  }

  return cellList
}

function findCells(cells: Cell[], payload: Cell[]) {
  const fCells: Cell[] = []

  for (const cell of cells) {
    const idx = payload.findIndex(payloadCell => {
      return payloadCell.x === cell.x && payloadCell.y === cell.y
    })

    if (idx !== -1) {
      fCells.push(cell)
    }
  }

  return fCells
}

function mutateCells(cells: Cell[]) {
  cells.forEach(cell => {
    cell.status = 1
  })
}

function getFullRowNos(cells: Cell[], rows: number, padding: number, cols: number) {
  const map: Record<number, number> = Array.from({ length: rows - padding * 2}, (_, idx) => idx + padding).reduce(
    (accu, num) => {
      return { ...accu, [num]: 0 }
    },
    {}
  )

  for (const cell of cells) {
    map[cell.y] = map[cell.y] + 1
  }

  const rowNos = Object.keys(map).filter(rowNo => {
    return map[+rowNo] === (cols - padding * 2)
  })

  return rowNos.map(n => +n)
}

function getClearCells (tagCells: Cell[], rowNos: number[]) {
  let cells: Set<Cell> = new Set()

  for (const rowNo of rowNos) {
    const clearCells = tagCells.filter(cell => {
      return cell.y <= rowNo
    })

    clearCells.forEach(c => cells.add(c))
  }

  return [...cells.values()] as Cell[]
}
