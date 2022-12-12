import { createElement, getById } from "../utils"
import { Theme } from "./theme"

export type ElementShape = 'auto' | 'circle' | 'rect' | 'path' | 'text' | 'save'
const DEFAULT_SHAPE: ElementShape = 'circle'

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
  {
    label: 'Text',
    shape: 'text',
    keyNo: '5',
  },
  {
    label: 'Save',
    shape: 'save',
    keyNo: '6',
  },
]

export class UI {

  shape: ElementShape

  elements: Array<UIElement> = ELEMENTS

  theme: Theme

  constructor(theme: Theme) {
    this.shape = DEFAULT_SHAPE
    this.theme = theme

    this.render()
  }

  handleItemClick(e: UIElement) {
    this.shape = e.shape

    if (this.shape === 'save') {
      this.theme.save()
    }

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
