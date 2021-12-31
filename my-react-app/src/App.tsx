import { useEffect, useRef } from "react";
import { drawSegmentsMap, drawSegments, mock } from "./game";

const BOARD_WIDTH = 300;
const BOARD_HEIGHT = 300;

const BLOCK_WIDTH = 30;
const BLOCK_HEIGHT = 30;

const movePoint = {
  x: 0,
  y: 0,
  speed: BLOCK_HEIGHT,
};

function draw(ctx: CanvasRenderingContext2D) {
  // drawShape(ctx);
  // drawSegmentsMap(ctx, segmentsMap);

  const ss = mock(movePoint);

  drawSegments(ctx, ss);
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const actionsRef = useRef({
    togglePaused() {},
    move() {},
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function clearRect() {
      ctx?.clearRect(0, 0, width, height);
    }

    function move() {
      movePoint.y += movePoint.speed;
      if (movePoint.y >= BOARD_HEIGHT - BLOCK_HEIGHT * 2 || movePoint.y <= 0) {
        movePoint.speed *= -1;
      }

      console.log(movePoint);
    }

    let paused = false;
    function togglePaused() {
      paused = !paused;
    }

    actionsRef.current = {
      togglePaused,
      move,
    };

    let frameId = requestAnimationFrame(run);
    let started: number,
      process: number,
      timeFlag = true,
      actionFlag: boolean;
    function run(times: any) {
      if (timeFlag) {
        started = times;
        timeFlag = !timeFlag;
      }

      process = times - started;
      actionFlag = process >= 1000;
      if (actionFlag) {
        timeFlag = true;
      }

      if (!paused) {
        loop(actionFlag);
      }

      frameId = requestAnimationFrame(run);
    }
    function loop(actionFlag: boolean) {
      if (!ctx) return;

      clearRect();

      if (actionFlag) {
        // move();
      }

      draw(ctx);
    }
  }, []);

  function handlePausedClick() {
    actionsRef.current.togglePaused();
  }

  function handleMoveClick() {
    actionsRef.current.move();
  }

  return (
    <div className="App">
      <div>
        <button onClick={handlePausedClick}>暂停</button>
        <button onClick={handleMoveClick}>Move(1)</button>
      </div>
      <canvas ref={canvasRef} width="300" height="300"></canvas>
    </div>
  );
}

export default App;
