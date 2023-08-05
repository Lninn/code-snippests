import './index.css'

import { App, Cell, createCells, rotateMatrix } from './config'
import { Player } from './player'
import { Grid } from './grid'



interface Timer {
  previous: number
  duration: number
}

const app = new App()


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
  const grid = new Grid(
    rows,
    cols,
    padding,
    size,
  )
  
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

      if (grid.hasSomeCellActive(nextCells)) {
        return
      }

      player.shape = nextShape
      player.cells = nextCells
    }
  }

  function update() {
    if (app.paused) return
  
    const nextY = player.y + 1
    const nextCells = createCells(player.shape, player.x, nextY, size)

    if (grid.isInteract(nextCells) || isBottom(rows, padding, nextY, player.shape)) {
      grid.update(player)
      timer.duration = 600
      player.reset()
    } else {
      player.y = nextY
      player.cells = nextCells
    }
  }

  function draw() {
    grid.draw(ctx)
    player.draw()
  }

  function loop(timestamp: number) {
    const diff = timestamp - timer.previous

    clear(ctx, width, height)

    if (diff > timer.duration) {
      update()

      timer.previous = timestamp
    }

    draw()

    requestAnimationFrame(loop)
  }

  window.addEventListener('keydown', onKeyDown)

  clear(ctx, width, height)
  draw()
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

function clear(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h)
}

main()
