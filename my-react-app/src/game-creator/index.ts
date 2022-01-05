import { Actions, ElementAction } from './type'
import { Store } from './store'

class ElementManage {
  store: Store

  constructor() {
    this.store = new Store()
  }

  dispatch(action: ElementAction) {
    this.store.dispatch(action)
  }

  update(timestamp: number) {
    this.store.update(timestamp)
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.store.draw(ctx)
  }
}

function gameCreator({ canvas }: { canvas: HTMLCanvasElement }) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    '2d',
  ) as CanvasRenderingContext2D

  const width = canvas.width
  const height = canvas.height

  const elementManage = new ElementManage()

  function clearRect() {
    ctx.clearRect(0, 0, width, height)
  }

  let frameId: number
  let isPaused = false
  function run(timestamp: number) {
    loop(timestamp)

    frameId = requestAnimationFrame(run)
  }

  function loop(timestamp: number) {
    clearRect()

    update(timestamp)

    draw()
  }

  function update(timestamp: number) {
    if (!isPaused) {
      elementManage.update(timestamp)
    }
  }

  function draw() {
    elementManage.draw(ctx)
  }

  function start() {
    draw()
    frameId = requestAnimationFrame(run)
  }

  function cancel() {
    cancelAnimationFrame(frameId)
  }

  const actions: Actions = {
    onPaused() {
      isPaused = !isPaused
    },
    move() {},
    onTransform() {},
    onPrint() {
      const { store } = elementManage
      console.log(store)
    },
  }

  function getActions(setActions: (actions: Actions) => void) {
    setActions(actions)
  }

  document.addEventListener('keyup', (e) => {
    const key = e.key

    if (key === 'ArrowRight' || key === 'd') {
      elementManage.dispatch('right')
    } else if (key === 'ArrowLeft' || key === 'a') {
      elementManage.dispatch('left')
    } else if (key === 'x') {
      elementManage.dispatch('transform')
    } else if (key === 's' || key === 'ArrowBottom') {
      elementManage.dispatch('bottom')
    }
  })

  return {
    start,
    cancel,
    getActions,
  }
}

export { gameCreator }
