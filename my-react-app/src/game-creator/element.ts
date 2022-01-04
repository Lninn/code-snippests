import { dataTransform, createPosition, calcEdgeForPositions } from './render'
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

  maxTimestamp: number = 650

  updateTimestamp(timestamp: number) {
    if (this.timeStatus) {
      this.timeStart = timestamp
      this.timeStatus = !this.timeStatus
    }

    this.timeProcess = timestamp - this.timeStart
    this.updateStatus = this.timeProcess >= this.maxTimestamp
    if (this.updateStatus) {
      this.timeStatus = true
    }
  }
}

function getInitialPostion(base: number): Point {
  return { x: 3, y: -base }
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
    this.position = getInitialPostion(this.getHeight() / Config.BlockSize)
    this.positions = createPosition(this.data, this.position)
  }

  getEdge(dir: Direction) {
    return calcEdgeForPositions(this.positions, dir)
  }

  getHeight() {
    return this.data.length * Config.BlockSize
  }

  getWidth() {
    return Math.max(...this.data.map((dataItem) => dataItem.length))
  }

  moveFast() {
    this.maxTimestamp = 25
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
