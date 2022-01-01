import { useEffect, useRef, useState } from "react";
import Controls from "./Controls";
import { currentElement } from "../game-creator";
import { Actions } from "../game-creator/type";

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

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [actions, setActions] = useState<Actions>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const manage = createManageGame({
      canvas,
      ctx,
      register(actions: Actions) {
        setActions(actions);
      },
    });

    manage.start();
  }, []);

  return (
    <div className="App">
      <Controls actions={actions} />

      <canvas ref={canvasRef} width="300" height="300"></canvas>
    </div>
  );
}

export default App;
