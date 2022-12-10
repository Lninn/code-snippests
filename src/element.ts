import { createElement, getById, getDistance, getRandomColor } from "./utils"

export interface Point {
  x: number
  y: number
}

type ElementShape = 'circle' | 'rect'
const DEFAULT_SHAPE: ElementShape = 'circle' 


interface UIElement {
  label: string
  shape: ElementShape
}

export class UI {

  shape: ElementShape

  elements: Array<UIElement> = [
    {
      label: 'Circle',
      shape: 'circle',
    },
    {
      label: 'Rect',
      shape: 'rect',
    }
  ]

  constructor() {
    this.shape = DEFAULT_SHAPE

    this.render()
  }

  handleItemClick(e: UIElement) {
    this.shape = e.shape

    this.render()
  }

  createElement(e: UIElement) {
    const element = createElement('div')

    element.classList.add('toolbar-item')
    if (e.shape === this.shape) {
      element.classList.add('active')
    }

    element.textContent = e.label

    element.onclick = () => {
      this.handleItemClick(e)
    }

    return element
  }

  render() {
    const list = getById('toolbarList')

    // 添加之前先清空
    list.innerHTML = ''

    for (const e of this.elements) {
      const element = this.createElement(e)
      list.appendChild(element)
    }
  }
}

export class Line {
  start: Point
  end: Point

  fillStyle: string

  constructor(start: Point, end: Point) {
    this.start = start
    this.end = end

    this.fillStyle = getRandomColor()
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.closePath()

    ctx.strokeStyle = this.fillStyle
    ctx.stroke()
  }
}

export class Element {
  shape: ElementShape
  x: number
  y: number
  
  fillStyle: string

  constructor(shape: ElementShape, x: number, y: number) {
    this.shape = shape
    this.x = x
    this.y = y

    this.fillStyle = getRandomColor()
  }

  isCircle() {
    return this.shape === 'circle'
  }

  isRect() {
    return this.shape === 'rect'
  }

  parseElementSize() {
    throw new Error('need implement')
  }

  updatePoint(point: Point) {
    throw new Error('need implement')
  }

  updateSize(downPoint: Point, movePoint: Point) {
    throw new Error('need implement')
  }

  draw(ctx: CanvasRenderingContext2D) {
    throw new Error('need implement')
  }
}

export class Circle extends Element {
  radius: number

  constructor(x: number, y: number, radius: number) {
    super('circle', x, y)
    this.radius = radius
  }

  parseElementSize() {
    //
  }

  updatePoint(point: Point) {
    this.x = point.x
    this.y = point.y
  }

  updateSize(downPoint: Point, movePoint: Point) {
    const d = getDistance(downPoint, movePoint)

    this.radius = d
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, radius } = this

    ctx.beginPath()
    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2,
      false,
    )
    ctx.closePath()
    
    // ctx.strokeStyle = '#000'
    // ctx.stroke()

    ctx.fillStyle = this.fillStyle
    ctx.fill()
  }
}

export class Rect extends Element {
  width: number
  height: number

  constructor(x: number, y: number, width: number, height: number) {
    super('rect', x, y)
    this.width = width
    this.height = height
  }

  parseElementSize() {
    // 当前的 element 的宽度和高度转换成正数

    const xAxis = this.width < 0
    const yAxis = this.height < 0

    if (xAxis) {
      this.width = Math.abs(this.width)
      this.x -= this.width
    }

    if (yAxis) {
      this.height = Math.abs(this.height)
      this.y -= this.height
    }
  }

  updatePoint(point: Point) {
    this.x = point.x
    this.y = point.y
  }

  updateSize(downPoint: Point, movePoint: Point) {
    const width = movePoint.x - downPoint.x
    const height = movePoint.y - downPoint.y

    this.width = width
    this.height = height
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height } = this

    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.closePath()
   
    // ctx.strokeStyle = '#000'
    // ctx.stroke()

    ctx.fillStyle = this.fillStyle
    ctx.fill()
  }
}

