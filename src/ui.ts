import { createElement, getById } from "./utils"

export type ElementShape = 'circle' | 'rect'
const DEFAULT_SHAPE: ElementShape = 'circle' 


export interface UIElement {
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
