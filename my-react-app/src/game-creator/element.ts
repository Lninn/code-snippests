import { dataTransform, createPosition } from './render'
import { Config, metaSources, randomKey } from './constant'
import { Source, Point, Direction, ElementAction } from './type'

export function getEdgePoints(
  positions: Point[],
  compareKey: keyof Point,
  getterKey: keyof Point,
  isGetMin = false,
) {
  const data: Record<number, Point> = {}

  function withMin(a: number, b: number) {
    return a <= b
  }
  function withMax(a: number, b: number) {
    return a >= b
  }

  const compareFn = isGetMin ? withMax : withMin

  positions.forEach((pos) => {
    const value = pos[compareKey]

    if (!data[value] || compareFn(data[value][getterKey], pos[getterKey]))
      data[value] = pos
  })

  return Object.keys(data).map((key) => data[+key])
}

class Updater {
  private timeStart: number = 0
  private timeProcess: number = 0

  public updateStatus: boolean = true
  private timeStatus: boolean = true

  updateTimestamp(timestamp: number) {
    if (this.timeStatus) {
      this.timeStart = timestamp
      this.timeStatus = !this.timeStatus
    }

    this.timeProcess = timestamp - this.timeStart
    this.updateStatus = this.timeProcess >= 1000
    if (this.updateStatus) {
      this.timeStatus = true
    }
  }
}

function getInitialPostion(): Point {
  return { x: 3, y: 0 }
}

class Element extends Updater {
  position!: Point
  data!: Source
  positions!: Point[]
  constructor() {
    super()

    this.initial()
  }

  private initial() {
    const key = randomKey()
    this.data = metaSources[key]
    this.position = getInitialPostion()
    this.positions = createPosition(this.data, this.position)
  }

  getEdge(dir: Direction) {
    switch (dir) {
      case 'top':
        return getEdgePoints(this.positions, 'x', 'y', true)
      case 'right':
        return getEdgePoints(this.positions, 'y', 'x')
      case 'bottom':
        return getEdgePoints(this.positions, 'x', 'y')
      case 'left':
        return getEdgePoints(this.positions, 'y', 'x', true)
    }
  }

  getHeight() {
    return this.data.length * Config.BlockSize
  }

  getWidth() {
    return Math.max(...this.data.map((dataItem) => dataItem.length))
  }

  onAction(actionType: ElementAction) {
    switch (actionType) {
      case 'right':
        this.position.x++
        break
      case 'bottom':
        this.position.y += 1
        break
      case 'left':
        this.position.x--
        break
      case 'transform':
        this.data = dataTransform(this.data)
        break
    }

    this.positions = createPosition(this.data, this.position)
  }

  update(timestamp: number) {
    super.updateTimestamp(timestamp)

    if (this.updateStatus) {
      this.onAction('bottom')
    }
  }
}

export { Element }
