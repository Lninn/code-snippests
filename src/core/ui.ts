import { createElement, getById } from "./utils"

export type ElementShape = 'auto' | 'circle' | 'rect' | 'path'
const DEFAULT_SHAPE: ElementShape = 'auto' 

export interface UIElement {
  label: string
  shape: ElementShape
  keyNo: string
}

const ELEMENTS: Array<UIElement> = [
  {
    label: 'Auto',
    shape: 'auto',
    keyNo: '1',
  },
  {
    label: 'Circle',
    shape: 'circle',
    keyNo: '2',
  },
  {
    label: 'Rect',
    shape: 'rect',
    keyNo: '3',
  },
  {
    label: 'Path',
    shape: 'path',
    keyNo: '4',
  },
]

export class UI {

  shape: ElementShape

  elements: Array<UIElement> = ELEMENTS

  constructor() {
    this.shape = DEFAULT_SHAPE

    this.render()
  }

  handleItemClick(e: UIElement) {
    this.shape = e.shape

    this.render()
  }

  handleKeyDown(key: string) {
    const ui = this.elements.find(
      e => e.keyNo === key
    )

    if (ui) {
      this.shape = ui.shape
    }

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
