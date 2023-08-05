import './index.css'


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

let paused = true

class Player {
  private ctx: CanvasRenderingContext2D
  public x: number
  public y: number

  public shape: number[][] = getShape()
  public cells: Cell[] = []
  private initValues: {
    x: number,
    y: number,
    size: number
  }
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    this.ctx = ctx
    this.x = x
    this.y = y

    this.initValues = {
      x,
      y,
      size
    }

    this.cells = createCells(this.shape, this.x, this.y, size)
  }

  public reset() {
    const { x, y, size } = this.initValues

    this.x = x
    this.y = y
    this.shape = getShape()
    this.cells = createCells(this.shape, this.x, this.y, size)
  }

  public move(step: number, size: number) {
    this.x = this.x + step
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

  const player = new Player(ctx, Math.floor(cols / 2), padding, size)
  const cellList = createGrid(size, rows, cols, padding)

  const timer: Timer = {
    previous: 0,
    duration: 100,
  }

  function onKeyDown(e: KeyboardEvent) {
    const k = e.key

    if (k === 'a') {
      player.move(-1, size)
    } else if (k ==='d') {
      player.move(1, size)
    } else if (k === 's') {
      timer.duration = 12
    }
  }

  function loop(timestamp: number) {
    const diff = timestamp - timer.previous
    if (diff > timer.duration) {

      clear(ctx, width, height)
      update(player, rows, size, padding, cellList, cols, timer)
      draw(ctx, player, cellList)

      timer.previous = timestamp
    }

    requestAnimationFrame(loop)
  }

  window.addEventListener('keydown', onKeyDown)
  clear(ctx, width, height)
  draw(ctx, player, cellList)
  requestAnimationFrame(loop)
}

function update(player: Player, rows: number, size: number, padding: number, cellList: Cell[], cols: number, timer: Timer) {
  if (paused) return

  const nextY = player.y + 1
  const nextCells = createCells(player.shape, player.x, nextY, size)

  if (
    isBottom(rows, padding, nextY, player.shape) || notCanMove(nextCells, cellList)
  ) {
    // paused = true

    const activeCells = getAcitveCells(cellList, player)
    mutateCells(activeCells)

    const tagCells = cellList.filter(c => c.status === 1)
    const fullRowNos = getFullRowNos(tagCells, rows, padding, cols)
    if (fullRowNos.length) {
      const waitClearCells = getClearCells(tagCells, fullRowNos)
      doClearCells(cellList, waitClearCells, fullRowNos)
    }

    timer.duration = 100
    player.reset()
  } else {
    player.y = nextY
    player.cells = nextCells
  }
}

function doClearCells(cells: Cell[], waitClearCells: Cell[], rowNos: number[]) {

  const downCells: Cell[] = []

  for (const cell of waitClearCells) {
    if (!rowNos.includes(cell.y)) {
      downCells.push(cell)
    }
  }

  waitClearCells.forEach(c => c.status = 0)

  const finalCells = cells.filter(cell => {
    return downCells.findIndex(downCell => {
      return downCell.x === cell.x && (downCell.y + 1) === cell.y
    }) !== -1
  })
  finalCells.forEach(c => c.status = 1)

}

function getClearCells (tagCells: Cell[], rowNos: number[]) {
  let cells: Cell[] = []

  for (const rowNo of rowNos) {
    const clearCells = tagCells.filter(cell => {
      return cell.y <= rowNo
    })

    cells = [...cells, ...clearCells]
  }

  return cells
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

main()
