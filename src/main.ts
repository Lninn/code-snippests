import './style.css'
import './toolbar.css'

import { Element } from './element'
import { Grid } from './grid'
import { Status, Sys } from './sys'
import { Timer } from './timer'
import {
  drawBg,
  drawGuideLine,
  getById,
  getMousePoint,
  isPointInElement,
} from './utils'
import { Rect } from './rect'
import { Circle } from './circle'
import { UI } from './ui'
import { Point } from './point'

const ID = 'canvas'

// TODO
// 1 侧边栏，现实当前的全局状态和画布内状态，激活元素，坐标等等
// 2 画布数据本地持久化存储
// 3 工具覆层，提供可以创建的图形，文字等等
// 4 实现一个可主动触发的动画管理，而不是一开始就启动一个完整的 timer

const INIT_POINT: Point = { x: 0, y: 0 }

function main() {
  const ctx = getContext()
  if (!ctx) return

  const downPoint: Point = { ...INIT_POINT }
  const movePoint: Point = { ...INIT_POINT }
  
  const ui = new UI()
  const sys = new Sys()
  const timer = new Timer()
  const grid = new Grid(ctx, 10, 10)

  const elements: Element[] = []

  const getNewElement = (point: Point): Element => {

    if (ui.shape === 'circle') {
      const circle = new Circle(
        point.x,
        point.y,
        0,
      )

      return circle
    } else {
      const rect: Rect = new Rect(
        point.x,
        point.y,
        0,
        0,
      )
  
      return rect
    }
    
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

    for (const e of elements) {
      e.update()
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

const getContext = () => {
  const canvas = getById<HTMLCanvasElement>(ID)
  if (!canvas) return

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  // const vw = 500
  // const vh = 500

  canvas.style.width = vw + 'px'
  canvas.style.height = vh + 'px'

  canvas.width = vw
  canvas.height = vh

  const ctx = canvas.getContext('2d')

  return ctx
}

main()
