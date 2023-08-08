const width = 375
const height = 667

const rows = 30
const size = Math.floor(height / rows)
const cols = Math.ceil(width / size)
const padding = 3

const canvas = createCanvas()
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

interface Cell {
  x: number
  y: number
  key: number
  status: 0 | 1
}

type Matrix = number[][]

const events: Record<string, () => void> = {}

const map: Record<string, Matrix> = {
  o: [
    [1, 1],
    [1, 1],
  ],
  i: [
    [1, 1, 1, 1]
  ],
  z: [
    [1, 1, 0],
    [0, 1, 1],
  ]
}

function pick(name?: string): Matrix {
  const names = Object.keys(map)
  const i = getRandomInt(0, names.length - 1)
  
  if (!name) {
    name = names[i]
  }

  return map[name]
}

class Sunwukong {
  private x: number
  private y: number
  private matrix: Matrix
  private hide: boolean

  public cells: Cell[]

  constructor() {
    this.x = 0
    this.y = 0
    this.cells = []
    this.matrix = []
    this.hide = false

    this.reset()
  }

  public hidePlayer() {
    this.hide = !this.hide
    screen(ctx)
  }

  public onLeft() {
    if (laosun.x === padding) {
      return
    }
  
    this.move(-1)
    screen(ctx)
  }
  
  public onRight() {
    const matrixSize = getSize(laosun.matrix)
    if (laosun.x + matrixSize.col === cols - padding) {
      return
    }
  
    this.move(1)
    screen(ctx)
  }
  
  public onTransform() {
    this.transform()
    screen(ctx)
  }

  public next() {
    const y = this.y + 1
    const nextCells = createPlayerCells(
      this.matrix,
      this.x,
      y,
    )
  
    this.y = y
    this.cells = nextCells
  
    screen(ctx)
  }

  public isBottom() {
    const y = this.y
    const matrixSize = getSize(this.matrix)
  
    const maxHeight = rows - padding - matrixSize.row - 1
  
    return y > maxHeight
  }

  public draw() {
    if (this.hide) return

    for (const cell of this.cells) {
      drawCell(ctx, cell, '#e74645', '#ffddd5')
    }
  }

  public reset() {
    const matrix = pick()
    const matrixSize = getSize(matrix)
  
    const midX = Math.floor((cols - matrixSize.col) / 2)
    const y = padding - 1
  
    this.x = midX
    this.y = y
    this.matrix = matrix
    this.cells = createPlayerCells(matrix, midX, y)
  }

  private transform() {
    const nextMatrix = rotate(this.matrix)
    const nextCells = createPlayerCells(
      nextMatrix,
      this.x,
      this.y,
    )
  
    this.matrix = nextMatrix
    this.cells = nextCells
  }
  
  private move(step: -1 | 1) {
    const x = this.x + step
    const nextCells = createPlayerCells(
      this.matrix,
      x,
      this.y,
    )
  
    this.x = x
    this.cells = nextCells
  }
}

const laosun = new Sunwukong()

class Game {
  public cells: Cell[]

  constructor() {
    this.cells = []

    this.init()
  }

  public rember() {
    console.log('rember')
    localStorage.setItem(
      'game.cells', JSON.stringify(this.cells)
    )
  }

  public drawCanvas(ctx: CanvasRenderingContext2D) {
    for (const cell of this.cells) {
      if (cell.status === 1) {
        drawCell(ctx, cell, '#3cb07e', '#b0823c')
      } else {
        drawCell(ctx, cell, '#6d6dfb', undefined)
      }
    }
  }

  public check() {
    if (laosun.isBottom()) {
      this.gameUpdate()
    } else {
      if (this.isNext()) {
        laosun.next()
      } else {
        this.gameUpdate()
      }
    }
  }

  private init() {
    let cells: Cell[] = []
    const values = localStorage.getItem(
      'game.cells'
    )
  
    try {
      if (values) {
        cells = JSON.parse(values)
      }
  
      if (!cells.length) {
        throw new Error('empty')
      }
      console.log('init from rember')
    } catch(err) {
      console.log('gameInit.err ', err)
      cells = createGridCells()
    }
  
    this.cells = cells
  }

  private deepCellsCheck(cells: Cell[]) {
    for (const cell of cells) {
      const tCell = this.cells.find(c => (
        c.x === cell.x && c.y === cell.y + 1
      ))
  
      if (tCell && tCell.status === 1) return false
    }
  
    return true
  }

  private isNext() {
    const tCells = getMaxDeepCeels()
  
    if (!tCells.length) return false
  
    return this.deepCellsCheck(tCells)
  }

  private isEnd() {
    const cells = this.cells.filter(c => c.y === padding)
  
    return cells.some(c => c.status === 1)
  }

  private gameCellsSet() {
    const keys = laosun.cells.map(c => c.key)
  
    this.cells.forEach(e => {
      if (keys.includes(e.key)) {
        e.status = 1
      }
    })
  }

  private gameUpdate() {
    this.gameCellsSet()
  
    if (this.isEnd()) {
      end()
    } else {
      const yList = this.getFullYList()
      if (yList.length) {
        timer.type = Type.Clear
        timer.yList = yList
        resetAfterClear()
      }
    }
  }

  private getFullYList() {
    const length = rows - padding * 2
    const list = Array.from({ length, }, (_, i) => i + padding)
    const map: Record<number, number> = list.reduce(
      (accu, num) => {
        return { ...accu, [num]: 0 }
      },
      {}
    )
  
    const tagCells = this.cells.filter(c => c.status === 1)
  
    for (const cell of tagCells) {
      map[cell.y] = map[cell.y] + 1
    }
  
    const yList = Object.keys(map).filter(rowNo => {
      return map[+rowNo] === (cols - padding * 2)
    })
  
    return yList.map(y => +y)
  }

}

const game = new Game()

const enum Type {
  Running,
  Clear,
}

const DURATION = 1000
const timer = {
  type: Type.Running,
  yList: [] as number[],
  previous: 0,
  duration: DURATION,
  paused: false,
  id: 0,
}

const animatTimer = {
  previous: -1,
  duration: 500,
}

register('a', laosun.onLeft)
register('ArrowLeft', laosun.onLeft)
register('d', laosun.onRight)
register('ArrowRight', laosun.onRight)
register('ArrowUp', laosun.onTransform)
register(' ', laosun.onTransform)

window.addEventListener('keydown', onKeydown)
window.addEventListener('click', handleClick)

function start() {
  bindEvents()
}

function end() {
  // TODO
  // 这里结束的时候，重新在另一个 定时器任务里执行状态的更新
  // 直接在当前运行的函数里执行不会生效

  setTimeout(() => {
    laosun.hidePlayer()
    cancelAnimationFrame(timer.id)
  }, 0);
}

function bindEvents() {
  const startBtn = document.getElementById('start')
  if (startBtn) {
    startBtn.onclick = main
  }

  const endBtn = document.getElementById('end')
  if (endBtn) {
    endBtn.onclick = end
  }

  const pausedbtn = document.getElementById('paused')
  if (pausedbtn) {
    pausedbtn.onclick = () => {
      timer.paused = !timer.paused
    }
  }

  const logBtn = document.getElementById('log')
  if (logBtn) {
    logBtn.onclick = () => {
      console.clear()
      console.log(
        laosun,
        game,
      )
    }
  }

  const hidePlayerBtn = document.getElementById('hide-player')
  if (hidePlayerBtn) {
    hidePlayerBtn.onclick = laosun.hidePlayer
  }

  const upSpeedBtn = document.getElementById('up-speed')
  if (upSpeedBtn) {
    upSpeedBtn.onclick = upSpeed
  }

  const remberBtn = document.getElementById('rember')
  if (remberBtn) {
    remberBtn.onclick = game.rember
  }
}

function main() {
  screen(ctx)

  loop(0)
}

function loop(timestamp: number) {
  switch (timer.type) {
    case Type.Clear:
      animat(timestamp)
      break
    case Type.Running:
      running(timestamp)
      break
  }

  timer.id = requestAnimationFrame(loop)
}

let aCells: Cell[]

function animat(timestamp: number) {
  const diff = timestamp - animatTimer.previous

  const y = timer.yList[timer.yList.length - 1]
  aCells = game.cells.filter(c => c.y === y)

  if (diff <= animatTimer.duration || animatTimer.previous === -1) {

    for (const cell of aCells) {
      const globalAlpha = diff / animatTimer.duration

      drawCell(ctx, cell, undefined, '#b0823c', globalAlpha)
    }

    if (animatTimer.previous === -1) {
      animatTimer.previous = timestamp
    }

  } else {

    aCells.forEach(c => c.status = 0)
    screen(ctx)

    console.log('结束')
    setTimeout(() => {
      cancelAnimationFrame(timer.id)
    }, 0)

  }

}

function running(timestamp: number) {
  const diff = timestamp - timer.previous

  if (diff > timer.duration) {
    if (!timer.paused) dispatch()

    timer.previous = timestamp
  }
}

function register(key: string, action: () => void) {
  events[key] = action
}

function handleClick(ev: MouseEvent) {
  const { clientX, clientY } = ev

  const { top, left } = canvas.getBoundingClientRect()

  const offsetX = clientX - left
  const offsetY = clientY - top

  const point: {
    x: number,
    y: number
  } = {
    x: Math.floor(offsetX / size),
    y: Math.floor(offsetY / size),
  }

  const key = point.x + point.y * cols

  const cell = game.cells.find(c => (
    c.key === key
  ))

  if (cell) {
    cell.status = cell.status === 1 ? 0 : 1
    screen(ctx)
  }
}

function onKeydown(e: KeyboardEvent) {
  const { key } = e

  const action = events[key]
  if (action) {
    action()
  }
}

function createCanvas() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement

  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  canvas.width = width
  canvas.height = height

  return canvas
}

function upSpeed() {
  timer.duration = 30
}

function dispatch() {
  game.check()
}

function screen(ctx: CanvasRenderingContext2D) {
  clearCanvas(ctx)

  game.drawCanvas(ctx)
  laosun.draw()
}

function clearCanvas(ctx: CanvasRenderingContext2D) {
  const {
    canvas: {
      width,
      height
    }
  } = ctx

  ctx.clearRect(0, 0, width, height)
}

function resetAfterClear() {
  // 在执行 动画之前好像也可以先 reset
  laosun.reset()
  screen(ctx)

  // 加速一次后恢复到正常的间隔
  if (timer.duration != DURATION) {
    timer.duration = DURATION
  }
}

function getMaxDeepCeels() {
  // 针对 cells 中的每一ge cell.x 标记其中 y 最大的 cell

  const map: Record<number, Cell> = {}

  for (const cell of laosun.cells) {
    
    let tCell = map[cell.x]
    
    if (!tCell) {
      tCell = cell
    } else {
      tCell = tCell.y > cell.y ? tCell : cell
    }
    
    map[cell.x] = tCell
  }

  return Object.values(map)
}

function createGridCells() {
  const cells: Cell[] = []

  // 横线
  let y = padding
  while(y < (rows - padding)) {

    // 竖线
    let x = padding
    while(x < (cols - padding)) {
      const key = x + y * cols
      const cell: Cell = { x, y, key, status: 0 }
      cells.push(cell)

      x++
    }

    y++
  }

  return cells
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  cell: Omit<Cell, 'status' | 'key'>,
  strokeStyle?: string,
  fillStyle?: string,
  globalAlpha?: number
) {
  const [
    left,
    top
  ] = [cell.x * size, cell.y * size]

  ctx.beginPath()
  ctx.rect(
    left,
    top,
    size,
    size
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

  if (globalAlpha) {
    const _a = ctx.globalAlpha
    ctx.globalAlpha = globalAlpha
    ctx.fill()
    ctx.globalAlpha = _a
  }
}

function rotate(m: Matrix) {
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

function getSize(m: Matrix) {
  const row = m.length
  const col = Math.max(...m.map(x => x.length))

  return { row, col }
}

function createPlayerCells(matrix: number[][], startX: number, startY: number) {
  const cells: Cell[] = []

  for (let y = 0; y < matrix.length; y++) {
    const sub = matrix[y]
    for (let x = 0; x < sub.length; x++) {
      const no = sub[x]

      if (no) {
        const fX = startX + x
        const fY = startY + y
        const key = fX + fY * cols

        const cell: Cell = {
          x: fX,
          y: fY,
          key,
          status: 1,
        }
        cells.push(cell)
      }
     
    }
  }

  return cells
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { start }
