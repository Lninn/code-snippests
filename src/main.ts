import './style.css'
import './toolbar.css'

import { Element } from './core/element'
import { Grid } from './core/grid'
import { Timer } from './core/timer'
import {
  drawBg,
  drawGuideLine,
  getById,
  getMousePoint,
  isPointInElement,
} from './utils'
import { Rect } from './core/rect'
import { Circle } from './core/circle'
import { UI } from './core/ui'
import { Point } from './core/point'
import { Path } from './core/path'
import { Text } from './core/text'
import { CHART_SCALE } from './config'
import { Theme } from './core/theme'

const ID = 'canvas'

// TODO
// 1 侧边栏，现实当前的全局状态和画布内状态，激活元素，坐标等等
// 2 画布数据本地持久化存储
// 3 工具覆层，提供可以创建的图形，文字等等
// 4 实现一个可主动触发的动画管理，而不是一开始就启动一个完整的 timer

export const enum Status {
  None = 'none',
  Create = 'create',
  Move = 'move',
}

const isCreate = (status: Status) => {
  return status === Status.Create
}

const isNormal = (status: Status) => {
  return status === Status.None
}

const isMoving = (status: Status) => {
  return status === Status.Move
}

const INIT_POINT: Point = { x: 0, y: 0 }

function main() {
  const ctx = getContext()
  if (!ctx) return

  const downPoint: Point = { ...INIT_POINT }
  const movePoint: Point = { ...INIT_POINT }

  let activeStatus: Status = Status.None
  let activeElement: Element | null = null

  const theme = new Theme()
  const ui = new UI(theme)
  const timer = new Timer()
  const grid = new Grid(
    ctx,
    10,
    10,
    theme.attrs.secondColor,
  )

  const elements: Element[] = []

  window.debug = () => {
    console.log(elements);
  }

  const clear = () => {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }

  timer.update = () => {
    if (isCreate(activeStatus)) {

      if (activeElement) {
        activeElement.updateSize(downPoint, movePoint)
      }

      return
    }

    if (isMoving(activeStatus)) {
      if (activeElement) {
        const offsetX = movePoint.x - downPoint.x
        const offsetY = movePoint.y - downPoint.y

        const point: Point = {
          x: offsetX,
          y: offsetY,
        }
        activeElement.move(point)
      }
    }

    if (isNormal(activeStatus)) {
      pointerCheck()
    }

    for (const e of elements) {
      e.update()
    }

  }

  timer.draw = () => {
    clear()

    drawBg(ctx)
    grid.draw(ctx)

    for (const element of elements) {
      element.draw(ctx)
    }

    drawGuideLine(ctx, movePoint)
  }

  const getNewElement = (point: Point): Element => {

    if (ui.shape === 'text') {
      return new Text(point)
    }

    if (ui.shape === 'path') {
      const path = new Path(point)
      return path
    }

    if (ui.shape === 'circle') {
      const circle = new Circle(
        point.x,
        point.y,
        0,
        theme.attrs.primaryColor,
      )

      return circle
    } else {
      const rect: Rect = new Rect(
        point.x,
        point.y,
        0,
        0,
        theme.attrs.primaryColor,
      )
  
      return rect
    }

  }

  const pointerCheck = () => {

    let cursor: CSSStyleDeclaration['cursor'] = ''
    for (const element of elements) {
      if (element.isPointInResizeBox(movePoint)) {
        // TODO 按照位置指定 pointer
        cursor = 'ew-resize'
      } else if (isPointInElement(movePoint, element)) {
        cursor = 'pointer'
      }
    }

    const canvas = ctx.canvas
    canvas.style.cursor = cursor

    return false
  }

  const handleMouseDown = (evt: MouseEvent) => {
    const point = getMousePoint(evt)
   
    // created
    if (ui.shape !== 'auto') {
      const element = getNewElement(point)

      // 新增应该更新 mousedownPoint
      downPoint.x = point.x
      downPoint.y = point.y
  
      activeStatus = Status.Create
      activeElement = element

      elements.push(element)
      return
    }

    clearElementsStatus(elements)

    let element = findElementByPoint(elements, point)
    if (element) {
      downPoint.x = point.x - element.x
      downPoint.y = point.y - element.y
      
      activeStatus = Status.Move
      activeElement = element

      element.isSelect = true
      return
    }
   
  }
  const handleMouseMove = (evt: MouseEvent) => {
    const point = getMousePoint(evt)

    movePoint.x = point.x
    movePoint.y = point.y

    if (ui.shape === 'path') {
      if (activeElement) {
        (activeElement as Path).append(point)
      }
    }
  }
  const handleMouseUp = (evt: MouseEvent) => {

    activeStatus = Status.None

    const point = getMousePoint(evt)

    if (activeElement) {
      // activeElement = null

      downPoint.x = point.x
      downPoint.y = point.y
    }
  }
  const handleKeyDown = (evt: KeyboardEvent) => {
    const { key } = evt

    if (ui.shape === 'text') {
      if (activeElement) {
        (activeElement as Text).append(key)
      }
      return
    }

    ui.handleKeyDown(key)
  }

  const canvas = ctx.canvas
  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('keydown', handleKeyDown)

}

const clearElementsStatus = (elements: Element[]) => {
  for (const e of elements) {
    if (e.isSelect) {
      e.isSelect = false
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

const getContext = () => {
  const canvas = getById<HTMLCanvasElement>(ID)
  if (!canvas) return

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  // const vw = 500
  // const vh = 500

  canvas.style.width = vw + 'px'
  canvas.style.height = vh + 'px'

  canvas.width = vw * CHART_SCALE
  canvas.height = vh * CHART_SCALE

  const ctx = canvas.getContext('2d')

  return ctx
}

main()
