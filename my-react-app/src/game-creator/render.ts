import { Source, Point, Segment, Rect } from './type'
import { Config } from './constant'

function dataTransform(data: Source) {
  const rowSpan = data.length
  const colSpan = Math.max(...data.map((dataItem) => dataItem.length))

  const newData: Source = [
    ...(Array.from({ length: colSpan }).map(() => []) as Source),
  ]

  for (let i = 0; i < rowSpan; i++) {
    for (let j = 0; j < colSpan; j++) {
      newData[j][i] = data[i][j]
    }
  }

  return newData
}

function createRect({ x, y }: Point): Rect {
  return {
    x,
    y,
    w: Config.BlockSize,
    h: Config.BlockSize,
  }
}

function isValidData(data: number) {
  return data === 1
}

function createRects(data: Source, targetPoint?: Point) {
  if (!targetPoint) {
    targetPoint = { x: 0, y: 0 }
  }

  const rects: Rect[] = []

  let x = targetPoint.x,
    y = targetPoint.y
  for (const dataItem of data) {
    if (Array.isArray(dataItem)) {
      x = targetPoint.x

      for (const subDataItem of dataItem) {
        const rect = createRect({ x, y })

        if (isValidData(subDataItem)) {
          rects.push(rect)
        }

        x = x + Config.BlockSize
      }
    }

    y = y + Config.BlockSize
  }

  return rects
}

function createPosition(data: Source, position: Point) {
  const points: Point[] = []

  data.forEach((dataList: number[], y: number) => {
    dataList.forEach((dataItem, x: number) => {
      const point = { x: x + position.x, y: y + position.y }

      if (isValidData(dataItem)) {
        points.push(point)
      }
    })
  })

  return points
}

function createPoints(unitPoints: Point[]) {
  return unitPoints.map((unitPoint) => {
    const x = unitPoint.x * Config.BlockSize
    const y = unitPoint.y * Config.BlockSize

    return {
      x,
      y,
    }
  })
}

function createSegments(rect: Rect) {
  const segments: Segment[] = []

  const { x, y, w, h } = rect

  // 上右下左
  const rectPoints: Point[] = [
    {
      x,
      y,
    },
    {
      x: x + w,
      y,
    },
    {
      x: x + w,
      y: y + h,
    },
    {
      x,
      y: y + h,
    },
  ]

  let start: Point,
    end: Point,
    i = 0
  for (; i < rectPoints.length; i++) {
    start = rectPoints[i]
    end = rectPoints[i + 1]

    if (!end) end = rectPoints[0]

    segments.push({
      start,
      end,
    })
  }

  return segments
}

function filterSegments(segments: Segment[]) {
  function createMark(segment: Segment) {
    const { start, end } = segment

    const s1 = [start.x, start.y].join('>')
    const s2 = [end.x, end.y].join('>')

    return [[s1, s2].join(','), [s2, s1].join(',')]
  }

  const cache: string[] = []
  const filterList: Segment[] = []

  segments.forEach((segment) => {
    const [s1, s2] = createMark(segment)

    if (!cache.includes(s1)) {
      if (!cache.includes(s2)) {
        filterList.push(segment)

        cache.push(s1)
      }
    }
  })

  return filterList
}

function createRectsSegments(rects: Rect[]) {
  const rectSegments: Segment[] = []

  for (const rect of rects) {
    const segments = createSegments(rect)

    rectSegments.push(...segments)
  }

  return filterSegments(rectSegments)
}

function drawSegment(ctx: CanvasRenderingContext2D, { start, end }: Segment) {
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.stroke()
  ctx.closePath()
}

function drawSegments(ctx: CanvasRenderingContext2D, segments: Segment[]) {
  for (const segment of segments) {
    drawSegment(ctx, segment)
  }
}

function drawPoint(ctx: CanvasRenderingContext2D, point: Point) {
  ctx.beginPath()
  ctx.rect(
    point.x * Config.BlockSize,
    point.y * Config.BlockSize,
    Config.BlockSize,
    Config.BlockSize,
  )
  ctx.stroke()
  ctx.closePath()
}

export {
  dataTransform,
  createRects,
  createPosition,
  createPoints,
  createRectsSegments,
  drawSegments,
  drawPoint,
}
