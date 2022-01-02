import { ElementKey, Actions } from "./type";
import { Element } from "./element";

const currentElement = new Element();

function gameCreator({ canvas }: { canvas: HTMLCanvasElement }) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  const width = canvas.width;
  const height = canvas.height;

  function clearRect() {
    ctx.clearRect(0, 0, width, height);
  }

  let frameId: number;
  let isPaused = false;
  function run(timestamp: number) {
    loop(timestamp);

    frameId = requestAnimationFrame(run);
  }

  function loop(timestamp: number) {
    clearRect();

    update(timestamp);

    draw();
  }

  function update(timestamp: number) {
    if (!isPaused) {
      currentElement.update(timestamp);
    }
  }

  function draw() {
    currentElement.draw(ctx);
  }

  function start() {
    draw();
    frameId = requestAnimationFrame(run);
  }

  function cancel() {
    cancelAnimationFrame(frameId);
  }

  const actions: Actions = {
    onPaused() {
      isPaused = !isPaused;
    },
    move() {
      currentElement.updateData();
    },
    onTransform() {
      currentElement.transform();
    },
    onPrint() {
      console.log(currentElement);
    },
    onElementUpdate(key: ElementKey) {
      currentElement.updateKey(key);
    },
  };

  function getActions(setActions: (actions: Actions) => void) {
    setActions(actions);
  }

  return {
    start,
    cancel,
    getActions,
  };
}

export { gameCreator };
