import { Actions, Direction, ElementAction, Point } from './type'
import { Element } from './element'
import { Config } from './constant'
import { createPosition, drawPoint, calcEdgeForPositions } from './render'

/**
 *
 * TODO
 * 1 向下加速效果 √
 * 2 完整的 row 消除 √
 * 3 计算分数 √
 * 4 判断游戏结束
 * 5 修复变形问题
 * 6 修复重复绘制线段问题
 *
 */

interface State {
  indexNos: string[]
  statusMap: Record<number, number>
  indexToCoordinatesMap: Record<number, Point>
  coordinatesToIndexMap: Record<string, number>
  // 0-9
  verticalStatus: boolean[]
}

function createState() {
  const colSpan = Config.BoardHeight / Config.BlockSize
  const rowSpan = Config.BoardWidth / Config.BlockSize

  const indexNos: string[] = []
  const statusMap: State['statusMap'] = {}
  const indexToCoordinatesMap: State['indexToCoordinatesMap'] = {}
  const coordinatesToIndexMap: State['coordinatesToIndexMap'] = {}

  let no = 0
  for (let i = 0; i < colSpan; i++) {
    for (let j = 0; j < rowSpan; j++) {
      statusMap[no] = 0
      indexToCoordinatesMap[no] = {
        x: j,
        y: i,
      }
      coordinatesToIndexMap[`${j}-${i}`] = no
      indexNos.push(no + '')

      no += 1
    }
  }

  const verticalStatus: State['verticalStatus'] = []
  for (let i = 0; i < rowSpan; i++) {
    verticalStatus[i] = false
  }

  return {
    indexNos,
    statusMap,
    indexToCoordinatesMap,
    coordinatesToIndexMap,
    verticalStatus,
  }
}

class ElementManage {
  currentElement: Element

  state: State

  userScore: number = 0

  constructor() {
    this.state = createState()

    this.currentElement = new Element()
  }

  updateScore(base: number) {
    this.userScore += base * 100
  }

  canMove(dir: Direction) {
    let nextGen: (p: Point) => Point

    if (dir === 'bottom') {
      nextGen = (point) => ({ ...point, y: point.y + 1 })
    } else {
      nextGen = (point) => ({
        ...point,
        x: dir === 'left' ? point.x - 1 : point.x + 1,
      })
    }

    const points = this.currentElement.getEdge(dir)

    const nextPoints = points.map((point) => nextGen(point))

    const indexNos = nextPoints
      .map((pos) => {
        return this.state.coordinatesToIndexMap[`${pos.x}-${pos.y}`]
      })
      .filter((item) => item !== undefined)

    return (
      indexNos.length > 0 &&
      nextPoints.length === indexNos.length &&
      indexNos.every((index) => {
        return this.state.statusMap[index] === 0
      })
    )
  }

  beforeMove() {
    this.currentElement.positions.forEach((pos) => {
      const index = this.state.coordinatesToIndexMap[`${pos.x}-${pos.y}`]
      this.state.statusMap[index] = 0
    })
  }

  afterMove() {
    this.currentElement.positions.forEach((pos) => {
      const index = this.state.coordinatesToIndexMap[`${pos.x}-${pos.y}`]
      this.state.statusMap[index] = 1
    })
  }

  onAction(actionType: ElementAction) {
    this.beforeMove()

    switch (actionType) {
      case 'bottom':
        this.currentElement.moveFast()
        break
      case 'right':
      case 'left':
        if (this.canMove(actionType)) {
          this.currentElement.onAction(actionType)
        }
        break

      case 'transform':
        this.currentElement.onAction('transform')
        break
    }

    this.afterMove()
  }

  update(timestamp: number) {
    if (this.state.verticalStatus.every((status) => status)) {
      return
    }

    if (this.canMove('bottom')) {
      this.beforeMove()
      this.currentElement.update(timestamp)
      this.afterMove()
    } else {
      this.markRowTag()
      this.updateMapStatus()

      this.currentElement = new Element()
    }
  }

  updateMapStatus() {
    const statusedPoints: Point[] = []
    const statusedIndexs: number[] = []

    let start = this.state.indexNos.length - 1
    let end = 0
    for (; start >= end; start--) {
      if (this.state.statusMap[start] === 1) {
        statusedPoints.push(this.state.indexToCoordinatesMap[start])
        statusedIndexs.push(start)
      }
    }

    const countMap: Record<number, number> = {}
    for (const point of statusedPoints) {
      if (countMap[point.y] === undefined) {
        countMap[point.y] = 1
      } else {
        countMap[point.y] = countMap[point.y] + 1
      }
    }

    const boardCount = Config.BoardWidth / Config.BlockSize
    const fullIndexs: string[] = []
    const unFullRowKeys: string[] = []

    Object.keys(countMap).forEach((countKey) => {
      if (countMap[+countKey] === boardCount) {
        fullIndexs.push(countKey)
      } else {
        unFullRowKeys.push(countKey)
      }
    })

    for (const index of fullIndexs) {
      this.state.statusMap[+index] = 0
    }

    if (fullIndexs.length) {
      statusedIndexs.forEach((index) => {
        this.state.statusMap[index] = 0
      })

      const newPoints = statusedPoints
        .filter((point) => {
          return unFullRowKeys.includes(point.y + '')
        })
        .map((point) => ({
          ...point,
          y: point.y + fullIndexs.length,
        }))

      newPoints.forEach((point) => {
        const index = this.state.coordinatesToIndexMap[`${point.x}-${point.y}`]
        this.state.statusMap[index] = 1
      })

      this.updateScore(fullIndexs.length)
    }
  }

  markRowTag() {
    const indexs = []

    for (const index of this.state.indexNos) {
      if (this.state.statusMap[+index] === 1) {
        indexs.push(index)
      }
    }

    const tagMap: Record<number, boolean> = {}
    const points = indexs.forEach((index) => {
      const point = this.state.indexToCoordinatesMap[+index]

      if (!tagMap[point.y]) {
        tagMap[point.y] = true
      }
    })

    Object.keys(tagMap).forEach((key) => {
      this.state.verticalStatus[+key] = true
    })
  }

  draw(ctx: CanvasRenderingContext2D) {
    const state = this.state

    state.indexNos.forEach((index) => {
      if (state.statusMap[+index] === 1) {
        const point = this.state.indexToCoordinatesMap[+index]
        drawPoint(ctx, point)
      }
    })
  }
}

function gameCreator({ canvas }: { canvas: HTMLCanvasElement }) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    '2d',
  ) as CanvasRenderingContext2D

  const width = canvas.width
  const height = canvas.height

  const elementManage = new ElementManage()

  function clearRect() {
    ctx.clearRect(0, 0, width, height)
  }

  let frameId: number
  let isPaused = false
  function run(timestamp: number) {
    loop(timestamp)

    frameId = requestAnimationFrame(run)
  }

  function loop(timestamp: number) {
    clearRect()

    update(timestamp)

    draw()
  }

  function update(timestamp: number) {
    if (!isPaused) {
      elementManage.update(timestamp)
    }
  }

  function draw() {
    elementManage.draw(ctx)
  }

  function start() {
    draw()
    frameId = requestAnimationFrame(run)
  }

  function cancel() {
    cancelAnimationFrame(frameId)
  }

  const actions: Actions = {
    onPaused() {
      isPaused = !isPaused
    },
    move() {
      elementManage.beforeMove()
      elementManage.currentElement.position.y += 1
      elementManage.currentElement.positions = createPosition(
        elementManage.currentElement.data,
        elementManage.currentElement.position,
      )
      elementManage.afterMove()
    },
    onTransform() {
      elementManage.currentElement.onAction('transform')
    },
    onPrint() {
      console.log(elementManage)
    },
  }

  function getActions(setActions: (actions: Actions) => void) {
    setActions(actions)
  }

  document.addEventListener('keyup', (e) => {
    const key = e.key

    if (key === 'ArrowRight' || key === 'd') {
      elementManage.onAction('right')
    } else if (key === 'ArrowLeft' || key === 'a') {
      elementManage.onAction('left')
    } else if (key === 'x') {
      elementManage.onAction('transform')
    } else if (key === 's' || key === 'ArrowBottom') {
      elementManage.onAction('bottom')
    }
  })

  return {
    start,
    cancel,
    getActions,
  }
}

export { gameCreator }
