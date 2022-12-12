import { getRandomColor } from "../utils"


interface IAttrs {
  primaryColor: string
  secondColor: string
}

export class Theme {
  private __cacheKey = 'theme_data'

  attrs: IAttrs

  constructor() {

    const attrs = this.getAttrs()
    this.attrs = attrs

  }

  private getAttrs() {
    let attrs = this._getAttrs()

    if (!attrs) {
      attrs = {
        primaryColor: getRandomColor(),
        secondColor: getRandomColor(),
      }
    }

    return attrs
  }

  private _getAttrs() {
    let data: IAttrs | null = null

    const source = localStorage.getItem(
      this.__cacheKey
    )
    try {
      if (source) {
        data = JSON.parse(source)
      }
    } catch (error) {
      console.error(error)
    }

    return data
  }

  private toJSON() {
    return JSON.stringify(
      this.attrs,
    )
  }

  save() {
    const json = this.toJSON()

    localStorage.setItem(
      this.__cacheKey,
      json,
    )
    console.log('[Theme] save')
  }

}
