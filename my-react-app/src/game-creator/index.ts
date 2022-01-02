import { ElementKey, Actions, Point } from "./type";
import { Element } from "./element";
import { Config } from "./constant";
import { drawPoint, getPointsEdge } from "./render";

type Cell = 0 | 1;
type Column = Cell[];
type Row = Column[];
export type DataMap = Row;
function createMap() {
  const map: DataMap = [];

  const rowCount = Config.BoardWidth / Config.BlockSize;
  const colCount = Config.BoardHeight / Config.BlockSize;

  for (let i = 0; i < rowCount; i++) {
    const column: Column = [];
    for (let j = 0; j < colCount; j++) {
      const cell: Cell = 0;

      column[j] = cell;
    }

    map[i] = column;
  }

  return map;
}

class ElementManage {
  currentElement: Element;

  cachePoints: Point[] = [];

  dataMap!: DataMap;

  constructor() {
    this.dataMap = createMap();

    this.currentElement = new Element(this.dataMap);
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

      this.updateDataMap();

      this.currentElement = new Element(this.dataMap);
    }
  }

  updateDataMap() {
    const { positions } = this.currentElement;
    positions.forEach((pos) => {
      this.dataMap[pos.x][pos.y] = 1;
    });
  }

  drawDataMap(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.dataMap.length; i++) {
      for (let j = 0; j < this.dataMap[i].length; j++) {
        const point = { x: j * Config.BlockSize, y: i * Config.BlockSize };

        if (this.dataMap[j][i] === 1) {
          drawPoint(ctx, point);
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // this.currentElement.draw(ctx);

    this.drawDataMap(ctx);

    // for (const point of this.cachePoints) {
    //   drawPoint(ctx, point);
    // }
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
      console.log(elementManage);
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
