const ID = 'canvas'

// TODO
// 1 侧边栏，现实当前的全局状态和画布内状态，激活元素，坐标等等
// 2 画布数据本地持久化存储
// 3 工具覆层，提供可以创建的图形，文字等等

interface Point {
  x: number
  y: number
}

class Rect {
  attrs: {
    x: number
    y: number
    width: number
    height: number
  }

  constructor(attrs: Rect['attrs']) {
    this.attrs = attrs
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height } = this.attrs

    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.closePath()
    
    // ctx.strokeStyle = '#000'
    // ctx.stroke()

    ctx.fillStyle = '#ccc'
    ctx.fill()
  }
}

// TODO
// 实现一个可主动触发的动画管理，而不是一开始就启动一个完整的 timer
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

class Player {
  elements: Rect[] = []

  add(rect: Rect) {
    this.elements.push(rect)
  }

  findElementByPoint(point: Point) {
    const elements = this.elements

    // 如果按照正常的顺序渲染，这里在查找时从后往前的方式更符合直觉
    // 因为按照点击事件从上往下的顺序，尽量从上面的元素开始对比

    let start = elements.length - 1
    for(; start >= 0; start--) {
      const element = elements[start]
      if (isPointInRect(point, element)) {
        return element
      }
    }

    return null
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const element of this.elements) {
      element.draw(ctx)
    }
  }
}

const enum Status {
  None = 'none',
  Create = 'create',
  Move = 'move',
}

class Sys {
  private status: Status = Status.None
  private element: Rect | null = null

  setElement(element: Rect | null) {
    this.element = element
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

function foo() {
  const ctx = getContext()
  if (!ctx) return

  const sys = new Sys()

  const mouseMovePoint: Point = {
    x: 0,
    y: 0,
  }
  const mouseDownPoint: Point = {
    x: 0,
    y: 0,
  }

  const timer = new Timer()
  const player = new Player()

  const getNewElement = (point: Point): Rect => {
    const rect = new Rect({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    })

    return rect
  }

  const handleClick = (point: Point) => {

    let element = player.findElementByPoint(point)
    if (element) {
      mouseDownPoint.x = point.x - element.attrs.x
      mouseDownPoint.y = point.y - element.attrs.y
      sys.setStatus(Status.Move)
      sys.setElement(element)
      return
    }

    element = getNewElement(point)

    // 新增应该更新 mousedownPoint
    mouseDownPoint.x = point.x
    mouseDownPoint.y = point.y

    sys.setElement(element)
    sys.setStatus(Status.Create)

    player.add(element)
  }

  const pointerCheck = () => {
    const elements = player.elements

    let cursor: CSSStyleDeclaration['cursor'] = ''
    for (const element of elements) {
      if (isPointInRect(mouseMovePoint, element)) {
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

    handleClick(point)
  })
  canvas.addEventListener('mousemove', (evt) => {
    const point = getMousePoint(evt)

    mouseMovePoint.x = point.x
    mouseMovePoint.y = point.y
  })
  canvas.addEventListener('mouseup', (evt) => {

    if (sys.isCreate()) {
      const element = sys.getElement()
      if (element) {
        // 当前的 element 的宽度和高度转换成正数

        const xAxis = element.attrs.width < 0
        const yAxis = element.attrs.height < 0

        if (xAxis) {
          element.attrs.width = Math.abs(element.attrs.width)
          element.attrs.x -= element.attrs.width
        }

        if (yAxis) {
          element.attrs.height = Math.abs(element.attrs.height)
          element.attrs.y -= element.attrs.height
        }

      }

    }

    sys.setStatus(Status.None)

    const point = getMousePoint(evt)

    const element = sys.getElement()
    if (element) {
      sys.setElement(null)

      mouseDownPoint.x = point.x
      mouseDownPoint.y = point.y
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

    const element = sys.getElement()
    if (sys.isCreate()) {

      if (element) {
        const width = mouseMovePoint.x - mouseDownPoint.x
        const height = mouseMovePoint.y - mouseDownPoint.y

        element.attrs.width = width
        element.attrs.height = height
      }

      return
    }

    if (sys.isMoving()) {
      if (element) {
        const offsetX = mouseMovePoint.x - mouseDownPoint.x
        const offsetY = mouseMovePoint.y - mouseDownPoint.y

        element.attrs.x = offsetX
        element.attrs.y = offsetY
      }
    }

    if (sys.isNormal()) {
      pointerCheck()
    }
  }

  timer.draw = () => {
    clear()

    drawBg(ctx)
    player.draw(ctx)
  }
 
}

const isPointInRect = (
  point: Point,
  rect: Rect,
) => {
  return (
    point.x >= rect.attrs.x && point.x <= rect.attrs.x + rect.attrs.width &&
    point.y >= rect.attrs.y && point.y <= rect.attrs.y + rect.attrs.height
  )
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
