export type Role = 0 | 1
export const isElement = (role: Role) => {
  return role === 0
}
export const isBoard = (role: Role) => {
  return role === 1
}

class Core {
  start: number
  process: number
  timestampLimit: number
  canRun: boolean
  ping: boolean

  // debug
  role: Role

  constructor() {
    this.start = 0
    this.process = 0
    this.timestampLimit = 1000
    this.canRun = true
    this.ping = true

    this.role = 0
  }

  moveFast() {
    this.timestampLimit = 25
  }

  update(timestamp: number) {
    if (this.ping) {
      this.start = timestamp
      this.ping = !this.ping
    }

    this.process = timestamp - this.start
    this.canRun = this.process >= this.timestampLimit
    if (this.canRun) {
      this.ping = true
    }
  }
}

export { Core }
