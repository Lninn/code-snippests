import { Source, Point, Segment, Rect, Direction } from './type'
import { Config } from './constant'

/**
 *
 * 0 1 0
 * 1 1 1
 *
 * 1 0
 * 1 1
 * 1 0
 *
 * 1 1 1
 * 0 1 0
 *
 * 0 1
 * 1 1
 * 0 1
 *
 * 行和列直接交互
 *
 */
function dataTransform(data: Source) {
  let rowSpan = data.length
  let colSpan = Math.max(...data.map((dataItem) => dataItem.length))

  let rowIndex = 0,
    colIndex = 0

  function createTwoDimensionalArrays(rowSpan: number, colSpan: number) {
    return Array.from({
      length: rowSpan,
    }).map(() =>
      Array.from({
        length: colSpan,
      }),
    )
  }

  const newData = createTwoDimensionalArrays(colSpan, rowSpan)

  while (rowIndex < rowSpan) {
    colIndex = 0

    while (colIndex < colSpan) {
      const num = data[rowIndex][colIndex]

      newData[colIndex][rowSpan - 1 - rowIndex] = num

      colIndex++
    }

    rowIndex++
  }

  return newData as Source
}

function calcEdgeForPositions(positions: Point[], direction: Direction) {
  // with left => right
  const isMax = (left: number, right: number) => {
    return left >= right
  }

  const isMin = (left: number, right: number) => {
    return left <= right
  }

  const isHorizontal = direction === 'left' || direction === 'right'

  let compareFunc: (a: number, b: number) => boolean,
    compareKey: keyof Point,
    fixedKey: keyof Point,
    fixedKeys: number[],
    limit: number

  if (isHorizontal) {
    compareKey = 'x'
    fixedKey = 'y'
  } else {
    compareKey = 'y'
    fixedKey = 'x'
  }

  fixedKeys = positions.map((pos) => pos[fixedKey])

  switch (direction) {
    case 'top':
      compareFunc = isMin
      limit = Config.BoardHeight / Config.BlockSize - 1
      break
    case 'right':
      compareFunc = isMax
      limit = 0
      break
    case 'bottom':
      compareFunc = isMax
      // TODO
      limit = -100
      break
    case 'left':
      compareFunc = isMin
      limit = Config.BoardWidth / Config.BlockSize - 1

      break
  }

  const markMap: Record<number, Point> = fixedKeys.reduce((target, next) => {
    return {
      ...target,
      [next]: {
        [compareKey]: limit,
      },
    }
  }, {})

  positions.forEach((pos) => {
    const key = pos[fixedKey]

    const a = markMap[key]

    const b = pos[compareKey]

    if (compareFunc(b, a[compareKey])) {
      markMap[key] = pos
    }
  })

  return Object.entries(markMap).map((item) => item[1]) as Point[]
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
  calcEdgeForPositions,
}
