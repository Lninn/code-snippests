import { Source, Point, ElementAction } from './type'
import { dataTransform, createPosition } from './render'
import { randomKey, Config, metaSources } from './constant'

class Element {
  source: Source
  unitSize: [number, number]
  position: Point
  positions: Point[]

  constructor() {
    const key = randomKey()
    const source = metaSources[key]

    const width = Math.max(...source.map((dataItem) => dataItem.length))
    const height = source.length

    const position = {
      x: Math.floor(Config.BoardWidth / Config.BlockSize / 2),
      y: -height,
    }
    const positions = createPosition(source, position)

    this.source = source
    this.unitSize = [width, height]
    this.position = position
    this.positions = positions
  }

  elementOnAction(actionType: ElementAction) {
    switch (actionType) {
      case 'bottom':
        this.position.y += 1
        break
      case 'right':
        this.position.x++
        break
      case 'left':
        this.position.x--
        break
      case 'transform':
        this.source = dataTransform(this.source)
        break
    }

    this.positions = createPosition(this.source, this.position)
  }
}

export { Element }
