export class Timer {
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
