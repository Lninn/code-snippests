import { Point } from './type'
import { Config } from './constant'
import { Element } from './element'

type CellStatus = 0 | 1

const isValidCell = (status: CellStatus) => status === 1

class Board {
  cellNos: number[]
  cellStatusMap: Record<number, CellStatus>
  noToPointMap: Record<number, Point>
  pointToNoMap: Record<string, number>
  verticalCellStatus: CellStatus[]

  constructor() {
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

    this.cellNos = cellNos
    this.cellStatusMap = cellStatusMap
    this.noToPointMap = noToPointMap
    this.pointToNoMap = pointToNoMap
    this.verticalCellStatus = verticalCellStatus
  }

  getKeyByPoint(point: Point) {
    return `${point.x}-${point.y}`
  }

  update() {
    const { cellNos, cellStatusMap, noToPointMap, pointToNoMap } = this

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

  updateCellsStatusByElement(element: Element, status: CellStatus) {
    const { cellStatusMap, pointToNoMap } = this
    const { positions } = element

    const cellNos = positions.map(
      (point) => pointToNoMap[this.getKeyByPoint(point)],
    )
    cellNos.forEach((no) => (cellStatusMap[no] = status))
  }
}

export { Board }
