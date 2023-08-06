import './index.css'

import { App, createCells } from './config'
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
    player,
  )

  const timer = new Timer(
    ctx
  )

  function onKeyDown(e: KeyboardEvent) {
    const k = e.key

    if (k === 'a' || k === 'd') {
      const step = k === 'a' ? -1 : 1
      grid.move(step)
    } else if (k === 's') {
      timer.flash()
    } else if (k === ' ') {
      grid.transform()
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
      player.updateByY(nextY, nextCells)
    }
  }

  timer.draw = () => {
    draw()
  }

  window.addEventListener('keydown', onKeyDown)
  timer.start()
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
