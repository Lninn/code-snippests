import { Actions, ElementAction, Point } from './type'
import { Store } from './store'

function gameCreator({ canvas }: { canvas: HTMLCanvasElement }) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    '2d',
  ) as CanvasRenderingContext2D

  const width = canvas.width
  const height = canvas.height

  const store = new Store()

  function clearRect() {
    ctx.clearRect(0, 0, width, height)
  }

  function getCanvasPoint(e: MouseEvent) {
    return {
      x: e.pageX - canvas.offsetLeft,
      y: e.pageY - canvas.offsetTop,
    }
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
      store.update(timestamp)
    }
  }

  function draw() {
    store.draw(ctx)
  }

  draw()
  function start() {
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
      console.log(store)
    },
  }

  function getActions(setActions: (actions: Actions) => void) {
    setActions(actions)
  }

  document.addEventListener('keyup', (e) => {
    const key = e.key

    if (key === 'ArrowRight' || key === 'd') {
      store.dispatch('right')
    } else if (key === 'ArrowLeft' || key === 'a') {
      store.dispatch('left')
    } else if (key === 'x') {
      store.dispatch('transform')
    } else if (key === 's' || key === 'ArrowBottom') {
      store.dispatch('bottom')
    }
  })

  return {
    start,
    cancel,
    getActions,
  }
}

export { gameCreator }
