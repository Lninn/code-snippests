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
  ]
}

function pick(): Matrix {
  return map['i']
}

const player = {
  x: 0,
  y: 0,
  matrix: [] as Matrix,
  cells: [] as Cell[],
}

reset()

const cells = createGridCells()

const game = {
  cells,
}

const timer = {
  previous: 0,
  duration: 1000,
  paused: false,
}

console.log(
  player,
)

register('a', onLeft)
register('ArrowLeft', onLeft)
register('d', onRight)
register('ArrowRight', onRight)
register('ArrowUp', onTransform)
register(' ', onTransform)

window.addEventListener('keydown', onKeydown)

function start() {
  main()
}

function main() {
  screen(ctx)

  requestAnimationFrame(loop)
}

function loop(timestamp: number) {
  const diff = timestamp - timer.previous

  if (diff > timer.duration) {
    if (!timer.paused) disatch()

    timer.previous = timestamp
  }

  requestAnimationFrame(loop)
}

function register(key: string, action: () => void) {
  events[key] = action
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

function onLeft() {
  playerMove(-1)
  screen(ctx)
}

function onRight() {
  playerMove(1)
  screen(ctx)
}

function onTransform() {
  playerTransform()
  screen(ctx)
}

function playerTransform() {
  const nextMatrix = rotate(player.matrix)
  const nextCells = createPlayerCells(
    nextMatrix,
    player.x,
    player.y,
  )

  player.matrix = nextMatrix
  player.cells = nextCells
}

function playerMove(step: -1 | 1) {
  const x = player.x + step
  const nextCells = createPlayerCells(
    player.matrix,
    x,
    player.y,
  )

  player.x = x
  player.cells = nextCells
}

function playerNext() {
  const y = player.y + 1
  const nextCells = createPlayerCells(
    player.matrix,
    player.x,
    y,
  )

  player.y = y
  player.cells = nextCells
}

function disatch() {
  check()
}

function check() {
  let canUpdateScreen = false

  if (isBottom()) {
    gameUpdate()
    canUpdateScreen = true
  } else {
    if (isNext()) {
      playerNext()
      canUpdateScreen = true
    } else {
      gameUpdate()
    }
  }

  if (canUpdateScreen) {
    screen(ctx)
  }
}

function screen(ctx: CanvasRenderingContext2D) {
  clearCanvas(ctx)
  drawCanvas(ctx)
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

function drawCanvas(ctx: CanvasRenderingContext2D) {
  for (const cell of game.cells) {
    if (cell.status === 1) {
      drawCell(ctx, cell, '#3cb07e', '#b0823c')
    } else {
      drawCell(ctx, cell, '#6d6dfb', undefined)
    }
  }

  for (const cell of player.cells) {
    drawCell(ctx, cell, '#e74645', '#ffddd5')
  }
}

function gameUpdate() {
  gameCellsSet()

  if (isEnoughToClear()) {
    doClear()
  }

  reset()
}

function isBottom() {
  const y = player.y
  const matrixSize = getSize(player.matrix)

  const maxHeight = rows - padding - matrixSize.row - 1

  return y > maxHeight
}

function isNext() {
  return true
}

function gameCellsSet() {}

function isEnoughToClear() {
  return true
}

function doClear() {}

function reset() {
  const matrix = pick()
  const matrixSize = getSize(matrix)

  const midX = Math.floor((cols - matrixSize.col) / 2)

  player.x = midX
  player.y = padding
  player.matrix = matrix
  player.cells = createPlayerCells(matrix, midX, padding)
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
  fillStyle?: string
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
        const key = x + y * cols

        const cell: Cell = {
          x: startX + x,
          y: startY + y,
          key,
          status: 0,
        }
        cells.push(cell)
      }
     
    }
  }

  return cells
}

export { start }
