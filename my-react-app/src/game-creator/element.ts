import {
  dataTransform,
  createRects,
  createRectsSegments,
  drawSegments,
  createPosition,
  createPoints,
} from "./render";
import { Source, Point, Segment, ElementKey } from "./type";
import { Config, metaSources, randomKey } from "./constant";
import { DataMap } from ".";

class Updater {
  private timeStart: number = 0;
  private timeProcess: number = 0;

  public updateStatus: boolean = true;
  private timeStatus: boolean = true;

  updateTimestamp(timestamp: number) {
    if (this.timeStatus) {
      this.timeStart = timestamp;
      this.timeStatus = !this.timeStatus;
    }

    this.timeProcess = timestamp - this.timeStart;
    this.updateStatus = this.timeProcess >= 1000;
    if (this.updateStatus) {
      this.timeStatus = true;
    }
  }
}

function getInitialPostion(): Point {
  return { x: 3, y: 0 };
}

interface State {
  segments: Segment[];
  position: Point;
}

class Element extends Updater {
  position!: Point;
  data!: Source;
  private segments!: Segment[];
  positions!: Point[];
  points!: Point[];

  dataMap!: DataMap;

  constructor(dataMap: DataMap) {
    super();

    this.dataMap = dataMap;

    this.initial();
  }

  private initial() {
    this.segments = [];

    const key = randomKey();
    this.data = metaSources[key];
    this.position = getInitialPostion();
    this.updateSegments();
  }

  getHeight() {
    return this.data.length * Config.BlockSize;
  }

  transform() {
    this.data = dataTransform(this.data);

    this.updateSegments();
  }

  moveLeft() {
    this.position.x--;
    this.updateSegments();
  }

  moveRight() {
    this.position.x++;
    this.updateSegments();
  }

  private updatePosition() {
    this.position.y++;
  }

  updateDataMap() {
    this.position.y++;

    const positions = createPosition(this.data, this.position);
    this.positions = positions;

    positions.forEach((pos) => {
      this.dataMap[pos.x][pos.y] = 1;
    });
  }

  private updateSegments() {
    const { data, position } = this;

    const newPoint: Point = {
      x: position.x * Config.BlockSize,
      y: position.y * Config.BlockSize,
    };

    const rects = createRects(data, newPoint);
    const newSegments = createRectsSegments(rects);

    this.positions = createPosition(this.data, position);
    this.points = createPoints(this.positions);
    this.segments = newSegments;
  }

  update(timestamp: number) {
    super.updateTimestamp(timestamp);

    if (this.updateStatus) {
      // this.updateData();

      this.updateDataMap();
    }
  }

  updateData() {
    this.updatePosition();
    this.updateSegments();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { segments } = this;

    drawSegments(ctx, segments);
  }
}

export { Element };
