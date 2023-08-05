import './index.css'


interface Cell {
  x: number
  y: number
  s: number
}

class T {
  private ctx: CanvasRenderingContext2D
  private x: number
  private y: number

  private shape = [
    // [1, 2],
    // [3, 4],

    [1, 2, 3],
    [ , 4],
  ]
  private cells: Cell[] = []
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    this.ctx = ctx
    this.x = x
    this.y = y

    this.createCells(size)
  }

  update(rows: number, size: number, padding: number) {
    this.move(rows, padding)
    this.createCells(size)
  }

  move(rows: number, padding: number) {
    const ac = this.y + 1

    if (ac > rows - 1 * (padding + 2)) {
      return
    }
  
    this.y = ac
  }

  createCells(size: number) {
    const cells: Cell[] = []

    for (let y = 0; y < this.shape.length; y++) {
      const sub = this.shape[y]
      for (let x = 0; x < sub.length; x++) {
        const no = sub[x]

        if (no) {
          const cell: Cell = {
            x: this.x + x,
            y: this.y + y,
            s: size,
          }
          cells.push(cell)
        }
       
      }
    }

    this.cells = cells
  }

  draw() {
    for (const cell of this.cells) {
      const [
        left,
        top
      ] = [cell.x * cell.s, cell.y * cell.s]
  
      this.ctx.beginPath()
      this.ctx.fillStyle = 'blue'
      this.ctx.rect(
        left,
        top,
        cell.s,
        cell.s
      )
      this.ctx.fill()
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
  const cols = width / size
  const padding = 3

  const block: Cell = {
    x: size * Math.floor(cols / 2),
    y: size * padding,
    s: size,
  }

  const t = new T(ctx, Math.floor(cols / 2), padding, size)
  const cellList = createGrid(size, rows, cols, padding)

  const timer = {
    previous: 0,
    duration: 1000,
  }

  function loop(timestamp: number) {
    const diff = timestamp - timer.previous
    if (diff > timer.duration) {

      clear(ctx, width, height)
      update(t, rows, size, padding)
      draw(ctx, t, cellList)

      timer.previous = timestamp
    }

    requestAnimationFrame(loop)
  }

  clear(ctx, width, height)
  draw(ctx, t, cellList)
  requestAnimationFrame(loop)
}

function draw(ctx: CanvasRenderingContext2D, t: T, cellList: Cell[]) {
  drawCellList(ctx, cellList)
  t.draw()
}

function drawCellList(ctx: CanvasRenderingContext2D, cellList: Cell[]) {
  for (const cell of cellList) {
    const [
      left,
      top
    ] = [cell.x * cell.s, cell.y * cell.s]

    ctx.beginPath()
    ctx.fillStyle = '#072448'
    ctx.rect(
      left,
      top,
      cell.s,
      cell.s
    )
    ctx.stroke()
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
      const cell = { x, y, s: size }
      cellList.push(cell)

      x++
    }

    y++
  }

  return cellList
}

function update(t: T, rows: number, size: number, padding: number) {
  t.update(rows, size, padding)
}

function clear(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h)
}

main()
