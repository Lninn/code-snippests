import { ElementKey, Actions, Point } from './type'
import { Element, getEdgePoints } from './element'
import { Config, Direction } from './constant'
import { createPosition, drawPoint } from './render'

interface State {
  indexNos: string[]
  statusMap: Record<number, number>
  indexToCoordinatesMap: Record<number, Point>
  coordinatesToIndexMap: Record<string, number>
}
;``
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

  return {
    indexNos,
    statusMap,
    indexToCoordinatesMap,
    coordinatesToIndexMap,
  }
}

class ElementManage {
  currentElement: Element

  state: State

  constructor() {
    this.state = createState()

    this.currentElement = new Element()
  }

  transform() {
    this.beforeMove()
    this.currentElement.transform()
    this.afterMove()
  }

  canMoveDown() {
    const bottomPoints = this.currentElement.getEdge('bottom')
    const nextPoints = bottomPoints.map((point) => {
      return {
        ...point,
        y: point.y + 1,
      }
    })
    const indexNos = nextPoints.map((pos) => {
      return this.state.coordinatesToIndexMap[`${pos.x}-${pos.y}`]
    })

    return indexNos.every((index) => {
      return this.state.statusMap[index] === 0
    })
  }

  canHorizontal(dir: Direction) {
    if (dir === 'left') {
      if (this.currentElement.position.x <= 0) {
        return false
      }

      return true
    } else if (dir === 'right') {
      if (
        this.currentElement.position.x + this.currentElement.getWidth() >=
        Config.BoardWidth / Config.BlockSize
      ) {
        return false
      }

      return true
    }

    return false
  }

  moveLeft() {
    if (!this.canHorizontal('left')) {
      return
    }

    this.beforeMove()
    this.currentElement.moveLeft()
    this.afterMove()
  }

  moveRight() {
    if (!this.canHorizontal('right')) {
      return
    }

    this.beforeMove()
    this.currentElement.moveRight()
    this.afterMove()
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

  update(timestamp: number) {
    if (this.canMoveDown()) {
      this.beforeMove()
      this.currentElement.update(timestamp)
      this.afterMove()
    } else {
      this.currentElement = new Element()
    }
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

const elementManage = new ElementManage()

function gameCreator({ canvas }: { canvas: HTMLCanvasElement }) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    '2d',
  ) as CanvasRenderingContext2D

  const width = canvas.width
  const height = canvas.height

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
      elementManage.currentElement.transform()
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
      elementManage.moveRight()
    } else if (key === 'ArrowLeft' || key === 'a') {
      elementManage.moveLeft()
    } else if (key === 'x') {
      elementManage.transform()
    }
  })

  return {
    start,
    cancel,
    getActions,
  }
}

export { gameCreator }
