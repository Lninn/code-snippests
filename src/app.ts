import {
  Element,
  Rect,
  Circle,
  Point,
} from './element'
import { Grid } from './grid'
import { getDistance } from './utils'

const ID = 'canvas'

// TODO
// 1 侧边栏，现实当前的全局状态和画布内状态，激活元素，坐标等等
// 2 画布数据本地持久化存储
// 3 工具覆层，提供可以创建的图形，文字等等
// 4 实现一个可主动触发的动画管理，而不是一开始就启动一个完整的 timer

class Timer {
  constructor() {
    this.start()
  }

  start() {
    const self = this
    const loop = () => {
      self.update()
      self.draw()

      requestAnimationFrame(loop)
    }

    loop()
  }

  update() {}

  draw() {}
}

const enum Status {
  None = 'none',
  Create = 'create',
  Move = 'move',
}

class Sys {
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

const INIT_POINT: Point = { x: 0, y: 0 }

function foo() {
  const ctx = getContext()
  if (!ctx) return

  const downPoint: Point = { ...INIT_POINT }
  const movePoint: Point = { ...INIT_POINT }
  
  const sys = new Sys()
  const timer = new Timer()
  const grid = new Grid(ctx, 15, 15)

  const elements: Element[] = []

  const getNewElement = (point: Point): Element => {

    const rect: Rect = new Rect(
      point.x,
      point.y,
      0,
      0,
    )

    return rect
  }

  const pointerCheck = () => {

    let cursor: CSSStyleDeclaration['cursor'] = ''
    for (const element of elements) {
      if (isPointInElement(movePoint, element)) {
        cursor = 'pointer'
      }
    }

    const canvas = ctx.canvas
    canvas.style.cursor = cursor

    return false
  }

  const canvas = ctx.canvas
  canvas.addEventListener('mousedown', (evt) => {
    const point = getMousePoint(evt)

    let element = findElementByPoint(elements, point)
    if (element) {
      downPoint.x = point.x - element.x
      downPoint.y = point.y - element.y
      sys.setStatus(Status.Move)
      sys.setElement(element)
      return
    }

    element = getNewElement(point)

    // 新增应该更新 mousedownPoint
    downPoint.x = point.x
    downPoint.y = point.y

    sys.setElement(element)
    sys.setStatus(Status.Create)

    elements.push(element)
  })
  canvas.addEventListener('mousemove', (evt) => {
    const point = getMousePoint(evt)

    movePoint.x = point.x
    movePoint.y = point.y
  })
  canvas.addEventListener('mouseup', (evt) => {

    if (sys.isCreate()) {
      sys.parseElementSize()
    }

    sys.setStatus(Status.None)

    const point = getMousePoint(evt)

    const element = sys.getElement()
    if (element) {
      sys.setElement(null)

      downPoint.x = point.x
      downPoint.y = point.y
    }
  })

  const clear = () => {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }

  timer.update = () => {
    sys.updateElement(downPoint, movePoint)

    if (sys.isNormal()) {
      pointerCheck()
    }
  }

  timer.draw = () => {
    clear()

    drawBg(ctx)
    grid.draw(ctx)

    drawGuideLine(ctx, movePoint)

    for (const element of elements) {
      element.draw(ctx)
    }
  }

}

const findElementByPoint = (elements: Element[], point: Point) => {
  // 如果按照正常的顺序渲染，这里在查找时从后往前的方式更符合直觉
  // 因为按照点击事件从上往下的顺序，尽量从上面的元素开始对比

  let start = elements.length - 1
  for(; start >= 0; start--) {
    const element = elements[start]
    if (isPointInElement(point, element)) {
      return element
    }
  }

  return null
}

const isPointInElement = (point: Point, e: Element) => {
  if (e.isCircle()) {
    return isPointInCircle(point, e as Circle)
  } else {
    return isPointInRect(point, e as Rect)
  }
}

const isPointInCircle = (
  point: Point,
  circle: Circle,
) => {
  const center: Point = {
    x: circle.x,
    y: circle.y,
  }
  const d = getDistance(point, center)

  return d <= circle.radius * 2
}

const isPointInRect = (
  point: Point,
  rect: Rect,
) => {
  return (
    point.x >= rect.x && point.x <= rect.x + rect.width &&
    point.y >= rect.y && point.y <= rect.y + rect.height
  )
}

const drawGuideLine = (ctx: CanvasRenderingContext2D, point: Point) => {
  const {
    canvas: {
      width,
      height,
    }
  } = ctx

  ctx.beginPath()
  ctx.moveTo(
    0,
    point.y,
  )
  ctx.lineTo(
    width,
    point.y,
  )
  ctx.closePath()
  
  ctx.strokeStyle = 'blue'
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(
    point.x,
    0,
  )
  ctx.lineTo(
    point.x,
    height,
  )
  ctx.closePath()

  ctx.strokeStyle = 'blue'
  ctx.stroke()
}

const drawBg = (ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas
  const { width, height } = canvas

  ctx.fillStyle = '#e5e5e5'
  ctx.rect(0, 0, width, height)
  ctx.fill()
}

const getMousePoint = (evt: MouseEvent) => {
  const { clientX, clientY } = evt

  const point: Point = {
    x: clientX,
    y: clientY,
  }

  return point
}

const getContext = () => {
  const canvas = getById<HTMLCanvasElement>(ID)
  if (!canvas) return

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  canvas.style.width = vw + 'px'
  canvas.style.height = vh + 'px'

  canvas.width = vw
  canvas.height = vh

  const ctx = canvas.getContext('2d')

  return ctx
}

const getById = <T = HTMLDivElement>(id: string) => document.getElementById(id) as T

export default foo
