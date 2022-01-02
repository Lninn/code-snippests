import { ElementKey, Actions } from "./type";
import { Element } from "./element";
import { Config } from "./constant";

function edgeCheck(element: Element) {
  return element.position.y >= Config.BoardHeight - element.getHeight();
}

class ElementManage {
  currentElement: Element;
  private elements: Element[] = [];

  constructor() {
    this.currentElement = new Element();
  }

  update(timestamp: number) {
    const { currentElement } = this;

    if (edgeCheck(currentElement)) {
      this.elements.push(currentElement);
      this.currentElement = new Element();
    } else {
      this.currentElement.update(timestamp);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.currentElement.draw(ctx);

    for (const element of this.elements) {
      element.draw(ctx);
    }
  }
}

const elementManage = new ElementManage();

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
      elementManage.update(timestamp);
    }
  }

  function draw() {
    elementManage.draw(ctx);
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
      elementManage.currentElement.updateData();
    },
    onTransform() {
      elementManage.currentElement.transform();
    },
    onPrint() {
      console.log(elementManage.currentElement);
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
