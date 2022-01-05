import { ElementAction, Point, Source } from './type'
import { Config, randomKey, metaSources } from './constant'
import {
  createPosition,
  drawPoint,
  calcEdgeForPositions,
  dataTransform,
} from './render'

type CellStatus = 0 | 1

const isValidCell = (status: CellStatus) => status === 1

class Store {
  core: {
    start: number
    process: number
    timestampLimit: number
    canRun: boolean
    ping: boolean
  }

  board: {
    cellNos: number[]
    cellStatusMap: Record<number, CellStatus>
    noToPointMap: Record<number, Point>
    pointToNoMap: Record<string, number>
    verticalCellStatus: CellStatus[]
  }

  element: {
    source: Source
    unitSize: [number, number]
    position: Point
    positions: Point[]
  }

  constructor() {
    this.core = this.createCoreState()
    this.board = this.createBoardState()
    this.element = this.createElement()
  }

  getKeyByPoint(point: Point) {
    return `${point.x}-${point.y}`
  }

  createCoreState() {
    const state = {
      start: 0,
      process: 0,
      timestampLimit: 1000,
      canRun: true,
      ping: true,
    }

    return state
  }

  createBoardState() {
    const colSpan = Config.BoardHeight / Config.BlockSize
    const rowSpan = Config.BoardWidth / Config.BlockSize

    const cellNos = []
    const cellStatusMap: Record<number, CellStatus> = {}
    const noToPointMap: Record<number, Point> = {}
    const pointToNoMap: Record<string, number> = {}

    let cellNo = 0
    for (let i = 0; i < colSpan; i++) {
      for (let j = 0; j < rowSpan; j++) {
        cellStatusMap[cellNo] = 0

        const point = {
          x: j,
          y: i,
        }
        const key = this.getKeyByPoint(point)

        noToPointMap[cellNo] = point
        pointToNoMap[key] = cellNo

        cellNos.push(cellNo)

        cellNo += 1
      }
    }

    const verticalCellStatus: CellStatus[] = []
    for (let i = 0; i < rowSpan; i++) {
      verticalCellStatus[i] = 0 as CellStatus
    }

    const state = {
      cellNos,
      cellStatusMap,
      noToPointMap,
      pointToNoMap,
      verticalCellStatus,
    }

    return state
  }

  resetElement() {
    this.element = this.createElement()
    this.core.timestampLimit = 600
  }

  createElement() {
    const key = randomKey()

    const source = metaSources[key]
    const width = Math.max(...source.map((dataItem) => dataItem.length))
    const height = source.length

    const position = {
      x: 3,
      y: -height,
    }

    const positions = createPosition(source, position)

    const state = {
      source,
      unitSize: [width, height] as [number, number],
      position,
      positions,
    }

    return state
  }

  getCellStatus(points: Point[]) {
    const { cellStatusMap, pointToNoMap } = this.board

    const cellNos = points.map(
      (point) => pointToNoMap[this.getKeyByPoint(point)],
    )

    return cellNos.map((no) => cellStatusMap[no])
  }

  update(timestamp: number) {
    if (this.canGoNextAction('bottom')) {
      this.beforeMove()
      this.updateByElement(timestamp)
      this.afterMove()
    } else {
      this.updatecellsMap()

      this.resetElement()
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const {
      board: { cellNos, cellStatusMap, noToPointMap },
    } = this

    cellNos.forEach((cellNo) => {
      if (isValidCell(cellStatusMap[cellNo])) {
        const point = noToPointMap[cellNo]
        drawPoint(ctx, point)
      }
    })
  }

  updateByElement(timestamp: number) {
    const { core } = this

    this.updateTimestamp(timestamp)

    if (core.canRun) {
      this.updateCellsStatusByElement(0)

      this.moveElementDown()

      this.updateCellsStatusByElement(1)
    }
  }

  updateTimestamp(timestamp: number) {
    const { core } = this

    if (core.ping) {
      core.start = timestamp
      core.ping = !core.ping
    }

    core.process = timestamp - core.start
    core.canRun = core.process >= core.timestampLimit
    if (core.canRun) {
      core.ping = true
    }
  }

  moveFast() {
    this.core.timestampLimit = 25
  }

  moveElementDown() {
    const { element } = this

    element.position.y += 1
    element.positions = createPosition(element.source, element.position)
  }

  updateCellsStatusByElement(status: CellStatus) {
    const { board, element } = this

    const { cellStatusMap, pointToNoMap } = board
    const { positions } = element

    const cellNos = positions.map(
      (point) => pointToNoMap[this.getKeyByPoint(point)],
    )
    cellNos.forEach((no) => (cellStatusMap[no] = status))
  }

  updatecellsMap() {
    const { board } = this
    const { cellNos, cellStatusMap, noToPointMap, pointToNoMap } = board

    const markedNos = cellNos.filter((no) => isValidCell(cellStatusMap[no]))
    const markedPoints = markedNos.map((no) => noToPointMap[no])

    const colSpan = Config.BoardWidth / Config.BlockSize
    const countOfVerticalPosMap: Record<number, number> = {}

    markedPoints.forEach((point) => {
      const { y } = point

      if (!countOfVerticalPosMap[y]) {
        countOfVerticalPosMap[y] = 1
      } else {
        countOfVerticalPosMap[y] += 1
      }
    })

    const erasedYPos = Object.keys(countOfVerticalPosMap).filter(
      (yPos) => countOfVerticalPosMap[+yPos] === colSpan,
    )

    if (erasedYPos.length) {
      const erasedPoints: Point[] = []
      const unErasedPoints: Point[] = []

      markedPoints.forEach((point) => {
        const { y } = point

        if (erasedYPos.includes(y + '')) {
          erasedPoints.push(point)
        } else {
          unErasedPoints.push(point)
        }

        // erased all points
        const no = pointToNoMap[this.getKeyByPoint(point)]
        cellStatusMap[no] = 0
      })

      erasedPoints
        .map((point) => pointToNoMap[this.getKeyByPoint(point)])
        .forEach((no) => (cellStatusMap[no] = 0))

      let nextPoints = unErasedPoints
      for (const yPos of erasedYPos) {
        nextPoints = nextPoints.map((point) => {
          if (point.y < +yPos) {
            return {
              ...point,
              y: point.y + 1,
            }
          }

          return point
        })
      }

      nextPoints
        .map((point) => pointToNoMap[this.getKeyByPoint(point)])
        .forEach((no) => (cellStatusMap[no] = 1))
    }
  }

  canGoNextAction(nextAction: ElementAction) {
    const { element, board } = this
    const { position, positions, source } = element
    const { cellStatusMap, pointToNoMap } = board

    let nextPositions: Point[] = [],
      nextSource: Source,
      edgePoints: Point[] = []
    if (nextAction !== 'transform') {
      edgePoints = calcEdgeForPositions(positions, nextAction)
    }

    switch (nextAction) {
      case 'right':
      case 'left':
        nextPositions = edgePoints.map((pos) => ({
          ...pos,
          x: nextAction === 'left' ? pos.x - 1 : pos.x + 1,
        }))
        break
      case 'bottom':
        nextPositions = edgePoints.map((pos) => ({
          ...pos,
          y: pos.y + 1,
        }))
        break

      case 'transform':
        nextSource = dataTransform(source)
        nextPositions = createPosition(nextSource, position)
        break
    }

    const cellNos = nextPositions
      .map((pos) => {
        return pointToNoMap[this.getKeyByPoint(pos)]
      })
      .filter((cellNo) => cellNo !== undefined)

    return (
      cellNos.length > 0 &&
      nextPositions.length === cellNos.length &&
      cellNos.every((cellNo) => {
        return !isValidCell(cellStatusMap[cellNo])
      })
    )
  }

  elementOnAction(actionType: ElementAction) {
    const { element } = this

    switch (actionType) {
      case 'right':
        element.position.x++
        break
      case 'left':
        element.position.x--
        break
      case 'transform':
        element.source = dataTransform(element.source)
        break
    }

    element.positions = createPosition(element.source, element.position)
  }

  dispatch(action: ElementAction) {
    this.beforeMove()

    switch (action) {
      case 'bottom':
        this.moveFast()
        break
      case 'right':
      case 'left':
      case 'transform':
        if (this.canGoNextAction(action)) {
          this.elementOnAction(action)
        }
        break
    }

    this.afterMove()
  }

  beforeMove() {
    const { board, element } = this
    const { positions } = element
    const { cellStatusMap, pointToNoMap } = board

    positions
      .map((pos) => pointToNoMap[this.getKeyByPoint(pos)])
      .forEach((cellNo) => (cellStatusMap[cellNo] = 0))
  }

  afterMove() {
    const { board, element } = this
    const { positions } = element
    const { cellStatusMap, pointToNoMap } = board

    positions
      .map((pos) => pointToNoMap[this.getKeyByPoint(pos)])
      .forEach((cellNo) => (cellStatusMap[cellNo] = 1))
  }
}

export { Store }
