import { dataTransform, createPosition } from './render'
import { Config, metaSources, randomKey } from './constant'
import { Source, Point } from './type'

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
  points!: Point[]

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

  getHeight() {
    return this.data.length * Config.BlockSize
  }

  getWidth() {
    return Math.max(...this.data.map((dataItem) => dataItem.length))
  }

  transform() {
    this.data = dataTransform(this.data)
    this.positions = createPosition(this.data, this.position)
  }

  moveLeft() {
    this.position.x--
    this.positions = createPosition(this.data, this.position)
  }

  moveRight() {
    this.position.x++
    this.positions = createPosition(this.data, this.position)
  }

  update(timestamp: number) {
    super.updateTimestamp(timestamp)

    if (this.updateStatus) {
      this.position.y += 1
      this.positions = createPosition(this.data, this.position)
    }
  }
}

export { Element }
