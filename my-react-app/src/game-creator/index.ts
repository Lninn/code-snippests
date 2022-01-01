import { ElementKey, Actions } from "./type";
import { Element } from "./element";
import { metaSources } from "./constant";

let currentElement = new Element(metaSources["T"]);

function updateKey(key: ElementKey) {
  currentElement = new Element(metaSources[key]);
}

// TODO
// 创建新的文件
let paused = false;
function getPaused() {
  return paused;
}
function updatePaused() {
  paused = !paused;
}

function createManageGame({
  canvas,
  ctx,
  register,
}: {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  register: (actions: Actions) => void;
}) {
  const width = canvas.width;
  const height = canvas.height;

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
    register({
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
        updateKey(key);
      },
    });

    draw();
    frameId = requestAnimationFrame(run);
  }

  function cancel() {
    cancelAnimationFrame(frameId);
  }

  return {
    start,
    cancel,
  };
}

export { createManageGame };
