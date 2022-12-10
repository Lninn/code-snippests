import { Element } from "./element"
import { Point } from "./point"

export const enum Status {
  None = 'none',
  Create = 'create',
  Move = 'move',
}

export class Sys {
  private status: Status = Status.None
  private element: Element | null = null

  setElement(element: Element | null) {
    this.element = element
  }

  updateElement(downPoint: Point, movePoint: Point) {
    const { element } = this
    if (this.isCreate()) {

      if (element) {
        element.updateSize(downPoint, movePoint)
      }

      return
    }

    if (this.isMoving()) {
      if (element) {
        const offsetX = movePoint.x - downPoint.x
        const offsetY = movePoint.y - downPoint.y

        const point: Point = {
          x: offsetX,
          y: offsetY,
        }
        element.updatePoint(point)
      }
    }
  }

  parseElementSize() {
    const { element } = this
    if (element) {
      element.parseElementSize()
    }
  }

  getElement() {
    return this.element
  }

  getStatus() {
    return this.status
  }

  setStatus(status: Status) {
    this.status = status
  }

  isCreate() {
    return this.status === Status.Create
  }

  isNormal() {
    return this.status === Status.None
  }

  isMoving() {
    return this.status === Status.Move
  }
}
