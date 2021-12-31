import { useEffect, useRef } from 'react'

const BOARD_WIDTH = 300
const BOARD_HEIGHT = 300

const BLOCK_WIDTH = 30
const BLOCK_HEIGHT = 30

type Point = {
  x: number
  y: number
}

interface Rect {
  x: number
  y: number
  w: number
  h: number
  speed: number
}

type Pos = [number, number]
interface Segment {
  start: Pos
  end: Pos
}

type Source = number[][]
let tShape: Source = [
  [1, 1, 1],
  [0, 1],
]

function createRectList(data: Source, point: Point) {
  const rectList: Rect[] = []

  let x = point.x,
    y = point.y
  for (const dataItem of data) {
    if (Array.isArray(dataItem)) {
      x = 0

      for (const subDataItem of dataItem) {
        const __rect: Rect = {
          x,
          y,
          w: BLOCK_WIDTH,
          h: BLOCK_HEIGHT,
          speed: 1,
        }

        if (isValidBlock(subDataItem)) {
          rectList.push(__rect)
        }

        x = x + BLOCK_WIDTH
      }
    }

    y = y + BLOCK_HEIGHT
  }

  return rectList
}

const movePoint = {
  x: 31,
  y: 31,
  speed: BLOCK_HEIGHT,
}

function isValidBlock(item: number) {
  return item === 1
}

function drawShape(ctx: CanvasRenderingContext2D) {
  const rectList = createRectList(tShape, movePoint)

  const sideList = createRectSides(rectList)

  // for (const rect of rectList) {
  //   drawRect(ctx, rect)
  // }

  console.log(sideList)

  for (const side of sideList) {
    drawSide(ctx, side)
  }
}

function drawSide(ctx: CanvasRenderingContext2D, side: Segment) {
  const { start, end } = side
  ctx.beginPath()
  ctx.moveTo(start[0], start[1])
  ctx.lineTo(end[0], end[1])
  ctx.stroke()
  ctx.closePath()
}

function createRectSides(rectList: Rect[]) {
  function createSides(rect: Rect) {
    const { x, y, w, h } = rect

    const points: Pos[] = [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ]

    let start: Pos,
      end: Pos,
      ret = []
    for (let i = 0; i < 4; i++) {
      start = points[i]
      end = points[i + 1]

      if (end === undefined) {
        end = points[0]
      }

      ret.push({ start, end })
    }

    return ret
  }

  const sideList = rectList.map(createSides).flat()

  function createTag(side: Segment) {
    const { start, end } = side

    const ret = [...start, ...end]
    ret.sort()

    return ret.toString()
  }

  const sideMap: Record<string, boolean> = {}
  const ret: Segment[] = []
  for (const side of sideList) {
    const tag = createTag(side)
    let isExisted = sideMap.hasOwnProperty(tag)

    if (!isExisted) {
      sideMap[tag] = true
      ret.push(side)
    }
  }

  console.log(sideMap)

  return ret
}

function drawRect(ctx: CanvasRenderingContext2D, rect: Rect) {
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.strokeStyle = 'red'
  ctx.rect(rect.x, rect.y, rect.w, rect.h)
  ctx.stroke()
  ctx.closePath()
}

function draw(ctx: CanvasRenderingContext2D) {
  drawShape(ctx)
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const actionsRef = useRef({
    togglePaused() {},
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function clearRect() {
      ctx?.clearRect(0, 0, width, height)
    }

    function move() {
      movePoint.y += movePoint.speed
      if (movePoint.y >= BOARD_HEIGHT - BLOCK_HEIGHT || movePoint.y <= 0) {
        movePoint.speed *= -1
      }
    }

    let paused = false
    function togglePaused() {
      paused = !paused
    }
    actionsRef.current = {
      togglePaused,
    }

    let frameId = requestAnimationFrame(run)
    let started: number,
      process: number,
      timeFlag = true,
      actionFlag: boolean
    function run(times: any) {
      if (timeFlag) {
        started = times
        timeFlag = !timeFlag
      }

      process = times - started
      actionFlag = process >= 1000
      if (actionFlag) {
        timeFlag = true
      }

      if (!paused) {
        loop(actionFlag)
      }

      // frameId = requestAnimationFrame(run)
    }
    function loop(actionFlag: boolean) {
      if (!ctx) return

      clearRect()

      if (actionFlag) {
        move()
      }

      draw(ctx)
    }
  }, [])

  function handlePausedClick() {
    actionsRef.current.togglePaused()
  }

  return (
    <div className="App">
      <div>
        <button onClick={handlePausedClick}>暂停</button>
      </div>
      <canvas ref={canvasRef} width="300" height="300"></canvas>
    </div>
  )
}

export default App
