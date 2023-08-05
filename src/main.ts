import './index.css'

import { App } from './config'


interface Cell {
  x: number
  y: number
  s: number
  status: 0 | 1
}

interface Timer {
  previous: number
  duration: number
}

type Key = 't' | 'o' | 'i' | 'l'
const shapeMap: Record<Key, number[][]> = {
  o: [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
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
  // const key = keys[i] as Key
  const key: Key = 'o'

  return shapeMap[key]
}

const app = new App()

class Player {
  private ctx: CanvasRenderingContext2D
  
  public x!: number
  public y!: number
  public shape!: number[][]
  public cells!: Cell[]
 
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

  public reset() {
    const { x, y, size } = this.initValues
    this.init(x, y, size)
  }

  private init(x: number, y: number, size: number) {
    this.shape = rotateMatrix(getShape())
    this.x = x - Math.floor(this.shape.length / 2)
    this.y = y
    this.cells = createCells(this.shape, this.x, this.y, size)
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
}

function main() {
  const element = document.getElementById('canvas')
  if (!element) return

  const canvas = element as HTMLCanvasElement

  const width = 375
  const height = 667

  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  const rows = 30
  const size = Math.floor(height / rows)
  const cols = Math.ceil(width / size)
  const padding = 3

  const player = new Player(ctx, Math.floor(cols / 2), padding + 4, size)
  const cellList = createGrid(size, rows, cols, padding)
  mock(cellList)

  const timer: Timer = {
    previous: 0,
    duration: 600,
  }

  function onKeyDown(e: KeyboardEvent) {
    const k = e.key

    if (k === 'a' || k === 'd') {
      const step = k === 'a' ? -1 : 1
     
      const nextCells = player.cells.map(c => {
        return {
          ...c,
          x: c.x + step
        }
      })

      const {
        leftBorder,
        rightBorder,
      } = borderCheck(nextCells, rows, cols, padding)

      if (leftBorder || rightBorder) {
        return
      }

      player.x = player.x + step
      player.cells = nextCells
    } else if (k === 's') {
      timer.duration = 12
    } else if (k === ' ') {
      const nextShape = rotateMatrix(player.shape)
      const nextCells = createCells(
        nextShape,
        player.x,
        player.y,
        size,
      )

      const {
        topBorder,
        bottomBorder,
        leftBorder,
        rightBorder,
      } = borderCheck(nextCells, rows, cols, padding)

      if (topBorder || bottomBorder || leftBorder || rightBorder) {
        return
      }

      if (hasSomeCellActive(cellList, nextCells)) {
        return
      }

      player.shape = nextShape
      player.cells = nextCells
    }

  }

  function loop(timestamp: number) {
    const diff = timestamp - timer.previous

    clear(ctx, width, height)

    if (diff > timer.duration) {
      update(player, rows, size, padding, cellList, cols, timer)

      timer.previous = timestamp
    }

    draw(ctx, player, cellList)

    requestAnimationFrame(loop)
  }

  window.addEventListener('keydown', onKeyDown)
  clear(ctx, width, height)
  draw(ctx, player, cellList)
  requestAnimationFrame(loop)
}

function getCellsBorder(cells: Cell[]) {
  const xList = cells.map(c => c.x)
  const yList = cells.map(c => c.y)
  
  const left = Math.min(...xList)
  const right = Math.max(...xList)

  const top = Math.min(...yList)
  const bottom = Math.max(...yList)

  return { top, right, bottom, left }
}

function update(player: Player, rows: number, size: number, padding: number, cellList: Cell[], cols: number, timer: Timer) {
  if (app.paused) return

  const nextY = player.y + 1
  const nextCells = createCells(player.shape, player.x, nextY, size)

  if (
    isBottom(rows, padding, nextY, player.shape) || notCanMove(nextCells, cellList)
  ) {

    const activeCells = getAcitveCells(cellList, player)
    mutateCells(activeCells)

    const tagCells = cellList.filter(c => c.status === 1)
    const fullRowNos = getFullRowNos(tagCells, rows, padding, cols)
    if (fullRowNos.length) {
      app.paused = true

      const waitClearCells = getClearCells(tagCells, fullRowNos)
      doClearCells(cellList, waitClearCells, fullRowNos)
    }

    timer.duration = 600
    player.reset()
  } else {
    player.y = nextY
    player.cells = nextCells
  }
}

function borderCheck(cells: Cell[], rows: number, cols: number, padding: number) {
  const {
    top,
    right,
    bottom,
    left
  } = getCellsBorder(cells)

  const topBorder = bottom < padding
  const bottomBorder = top > rows - padding - 1
  
  const leftBorder = left < padding
  const rightBorder = right > cols - padding - 1

  return {
    topBorder,
    rightBorder,
    bottomBorder,
    leftBorder,
  }
}

function doClearCells(cells: Cell[], waitClearCells: Cell[], rowNos: number[]) {

  let downCells: Cell[] = []

  for (const cell of waitClearCells) {
    if (!rowNos.includes(cell.y)) {
      downCells.push(cell)
    }
  }

  // TODO
  // 多行消除后，剩下的 cells 应该下移相同的 分量

  waitClearCells.forEach(c => c.status = 0)
  console.log(downCells)

  // downCells = downCells.map(c => {
  //   return { ...c, y: c.y + 1 }
  // })

  // const actCells = findCells(
  //   cells,
  //   downCells
  // )

  // console.log(actCells)

  // actCells.forEach(c => c.status = 1)
  // downCells.forEach(c => c.status = 0)

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

function isBottom(rows: number, padding: number, y: number, shape: number[][]) {
  const length = shape.length

  return y > rows - padding - length
}

function notCanMove(nextCells: Cell[], cellList: Cell[]) {
  const existCells = cellList.filter(cell => {
    return nextCells.findIndex(nextCell => nextCell.x === cell.x && nextCell.y === cell.y) !== -1
  })

  return existCells.some(cell => cell.status === 1)
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

function getAcitveCells(cells: Cell[], t: Player) {
  const acCells: Cell[] = []

  for (const cell of cells) {
    if (t.isCellActive(cell)) {
      acCells.push(cell)
    }
  }

  return acCells
}

function draw(ctx: CanvasRenderingContext2D, t: Player, cellList: Cell[]) {
  drawCellList(ctx, cellList)
  t.draw()
}

function drawCellList(ctx: CanvasRenderingContext2D, cellList: Cell[]) {
  const acCells = cellList.filter(cell => cell.status === 1)

  for (const cell of cellList) {
    drawCell(ctx, cell, '#072448', undefined)
  }

  for (const cell of acCells) {
    drawCell(ctx, cell, 'blue', 'red')
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

function clear(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h)
}

function hasSomeCellActive(cells: Cell[], targetCells: Cell[]) {
  for (const targetCell of targetCells) {
    const eachCell = cells.find(cell => cell.x === targetCell.x && cell.y === targetCell.y)
    if (eachCell && eachCell.status === 1) return true
  }

  return false
}

function createCells(shape: number[][], startX: number, startY: number, size: number) {
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

function drawCell(ctx: CanvasRenderingContext2D, cell: Cell, strokeStyle?: string, fillStyle?: string) {
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

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rotateMatrix(m: number[][]) {
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

function mock(cells: Cell[]) {

  const rows = [
    24,
    25,
    26,
  ]

  for (const cell of cells) {
    if (rows.includes(cell.y) && cell.x > 4) {
      cell.status = 1
    }
  }

}

main()
