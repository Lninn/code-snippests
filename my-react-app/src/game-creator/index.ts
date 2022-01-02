import { ElementKey, Actions } from "./type";
import { Element } from "./element";

const currentElement = new Element();

// TODO
// 创建新的文件
let paused = false;
function getPaused() {
  return paused;
}
function updatePaused() {
  paused = !paused;
}

function gameCreator({ canvas }: { canvas: HTMLCanvasElement }) {
  const ctx: CanvasRenderingContext2D = canvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  const width = canvas.width;
  const height = canvas.height;

  const actions: Actions = {
    onPaused() {
      updatePaused();
    },
    move() {
      currentElement.update();
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

  function clearRect() {
    ctx.clearRect(0, 0, width, height);
  }

  function update(actionFlag: boolean) {
    if (!getPaused() && actionFlag) {
      currentElement.update();
    }
  }

  function draw() {
    currentElement.draw(ctx);
  }

  let frameId: number;
  let started: number,
    process: number,
    timeFlag = true,
    actionFlag: boolean;
  function run(times: any) {
    if (timeFlag) {
      started = times;
      timeFlag = !timeFlag;
    }

    // TODO
    // 分离出更新执行的逻辑
    process = times - started;
    actionFlag = process >= 1000;
    if (actionFlag) {
      timeFlag = true;
    }

    loop(actionFlag);

    frameId = requestAnimationFrame(run);
  }

  function loop(actionFlag: boolean) {
    clearRect();

    update(actionFlag);

    draw();
  }

  function start() {
    draw();
    frameId = requestAnimationFrame(run);
  }

  function cancel() {
    cancelAnimationFrame(frameId);
  }

  return {
    start,
    cancel,
    getActions,
  };
}

export { gameCreator };
