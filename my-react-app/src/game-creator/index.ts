import { ElementKey, Actions, Point } from "./type";
import { Element } from "./element";
import { Config } from "./constant";
import { drawPoint, getPointsEdge } from "./render";

class ElementManage {
  currentElement: Element;

  cachePoints: Point[] = [];

  constructor() {
    this.currentElement = new Element();
  }

  canMove() {
    const elementEdge = getPointsEdge(this.currentElement.points, "bottom");
    const boardEdge = getPointsEdge(this.cachePoints, "top");

    const keys = Object.keys(elementEdge);
    for (const key of keys) {
      const elementVal = (elementEdge[+key] ?? 0) + Config.BlockSize;
      const boardVal = boardEdge[+key] ?? Config.BoardHeight;

      if (elementVal + Config.BlockSize > boardVal) {
        return false;
      }
    }

    return true;
  }

  moveLeft() {
    this.currentElement.moveLeft();
  }

  moveRight() {
    this.currentElement.moveRight();
  }

  update(timestamp: number) {
    if (this.canMove()) {
      this.currentElement.update(timestamp);
    } else {
      this.cachePoints.push(...this.currentElement.points);

      this.currentElement = new Element();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.currentElement.draw(ctx);

    for (const point of this.cachePoints) {
      drawPoint(ctx, point);
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
      elementManage.canMove();
    },
  };

  function getActions(setActions: (actions: Actions) => void) {
    setActions(actions);
  }

  document.addEventListener("keyup", (e) => {
    const key = e.key;

    if (key === "ArrowRight" || key === "d") {
      elementManage.moveRight();
    } else if (key === "ArrowLeft" || key === "a") {
      elementManage.moveLeft();
    }
  });

  return {
    start,
    cancel,
    getActions,
  };
}

export { gameCreator };
