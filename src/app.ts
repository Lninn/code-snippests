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
    
    ctx.strokeStyle = '#000'
    ctx.stroke()

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
  activeElement: Rect | null = null

  add(rect: Rect) {
    this.elements.push(rect)
  }

  getActiveElement(point: Point) {
    const elements = this.elements

    for (const element of elements) {
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

function foo() {
  const ctx = getContext()
  if (!ctx) return

  let isPress = false

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

  const handleClick = (point: Point) => {

    const activeElement = player.getActiveElement(point)
    if (activeElement) {
      player.activeElement = activeElement

      mouseDownPoint.x = point.x - activeElement.attrs.x
      mouseDownPoint.y = point.y - activeElement.attrs.y
      return
    }

    const rect = new Rect({
      x: point.x - 50,
      y: point.y - 50,
      width: 100,
      height: 100,
    })

    player.add(rect)
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

    isPress = true
    handleClick(point)
  })
  canvas.addEventListener('mousemove', (evt) => {
    const point = getMousePoint(evt)

    mouseMovePoint.x = point.x
    mouseMovePoint.y = point.y
  })
  canvas.addEventListener('mouseup', (evt) => {
    isPress = false

    const point = getMousePoint(evt)

    const element = player.activeElement
    if (element) {
      player.activeElement = null

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
    const element = player.activeElement

    if (isPress) {
      if (element) {
        const offsetX = mouseMovePoint.x - mouseDownPoint.x
        const offsetY = mouseMovePoint.y - mouseDownPoint.y

        element.attrs.x = offsetX
        element.attrs.y = offsetY
      }
    } else {
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
