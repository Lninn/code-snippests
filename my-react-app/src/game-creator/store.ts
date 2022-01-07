import { ElementAction, Point, Source } from './type'
import {
  createPosition,
  drawPoint,
  calcEdgeForPositions,
  dataTransform,
} from './render'

import { Element } from './element'
import { Core } from './core'
import { Board } from './board'

type CellStatus = 0 | 1

const isValidCell = (status: CellStatus) => status === 1

class Store {
  board: Board

  core: Core

  element: Element

  constructor() {
    this.core = new Core()
    this.board = new Board()
    this.element = new Element()
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

  resetElement() {
    this.element = new Element()
    this.core.timestampLimit = 600
  }

  update(timestamp: number) {
    if (this.canGoNextAction('bottom')) {
      this.board.updateCellsStatusByElement(this.element, 0)
      this.updateByElement(timestamp)
      this.board.updateCellsStatusByElement(this.element, 1)
    } else {
      this.board.update()

      this.resetElement()
    }
  }

  __update(timestamp: number) {
    this.core.update(timestamp)

    if (this.core.canRun) {
      this.board.updateCellsStatusByElement(this.element, 0)
      this.__update_status()
      this.board.updateCellsStatusByElement(this.element, 1)
    }
  }

  __update_status() {
    // TODO 处理所有的 action
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
    this.core.update(timestamp)

    if (this.core.canRun) {
      this.board.updateCellsStatusByElement(this.element, 0)

      this.element.elementOnAction('bottom')

      this.board.updateCellsStatusByElement(this.element, 1)
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
        return pointToNoMap[this.board.getKeyByPoint(pos)]
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

  dispatch(action: ElementAction) {
    this.board.updateCellsStatusByElement(this.element, 0)

    switch (action) {
      case 'bottom':
        this.core.moveFast()
        break
      case 'right':
      case 'left':
      case 'transform':
        if (this.canGoNextAction(action)) {
          this.element.elementOnAction(action)
        }
        break
    }

    this.board.updateCellsStatusByElement(this.element, 1)
  }
}

export { Store }
