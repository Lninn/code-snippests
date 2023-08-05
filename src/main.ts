import './index.css'

import { App, Cell, createCells, rotateMatrix } from './config'
import { Player } from './player'
import { Grid } from './grid'


class Timer {
  private ctx: CanvasRenderingContext2D
  private previous: number
  private duration: number
  private mode: 0 | 1 = 0

  constructor(ctx: CanvasRenderingContext2D) {
    this.previous = 0
    this.duration = 600

    this.ctx = ctx

    this.loop = this.loop.bind(this)
  }

  public loop(timestamp: number) {
    const diff = timestamp - this.previous

    clear(this.ctx)

    if (diff > this.duration) {
      this.update()

      this.previous = timestamp
    }

    this.draw()
    requestAnimationFrame(this.loop)
  }

  public flash() {
    this.duration = 10
    this.mode = 1
  }

  public check() {
    if (this.mode === 1) {
      this.mode = 0
      this.duration = 600
    }
  }

  public start() {
    clear(this.ctx)
    this.draw()

    requestAnimationFrame(this.loop)
  }

  public update() {}
  public draw() {}
}

function main() {
  const element = document.getElementById('canvas')
  if (!element) return

  const app = new App(element as HTMLCanvasElement)

  const {
    ctx,
    rows,
    cols,
    padding,
    size
  } = app

  const player = new Player(
    ctx,
    Math.floor(cols / 2),
    padding + 4,
    size
  )
  const grid = new Grid(
    rows,
    cols,
    padding,
    size,
  )

  const timer = new Timer(
    ctx
  )

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
      timer.flash()
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

      if (grid.hasSomeCellActive(nextCells)) {
        return
      }

      player.shape = nextShape
      player.cells = nextCells
    }
  }

  function draw() {
    grid.draw(ctx)
    player.draw()
  }

  timer.update = () => {
    if (app.paused) return
  
    const nextY = player.y + 1
    const nextCells = createCells(player.shape, player.x, nextY, size)

    if (grid.isInteract(nextCells) || isBottom(rows, padding, nextY, player.shape)) {
      grid.update(player)
      timer.check()
      player.reset()
    } else {
      player.y = nextY
      player.cells = nextCells
    }
  }

  timer.draw = () => {
    draw()
  }

  window.addEventListener('keydown', onKeyDown)
  timer.start()
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

function borderCheck(cells: Cell[], rows: number, cols: number, padding: number) {
  // TODO 内容的 check

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

function isBottom(rows: number, padding: number, y: number, shape: number[][]) {
  const length = shape.length

  return y > rows - padding - length
}

function clear(ctx: CanvasRenderingContext2D) {
  const {
    canvas: {
      width,
      height
    }
  } = ctx

  ctx.clearRect(0, 0, width, height)
}

main()
