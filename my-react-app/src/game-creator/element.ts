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
    this.updateStatus = this.timeProcess >= 300;
    if (this.updateStatus) {
      this.timeStatus = true;
    }
  }
}

function getInitialPostion(): Point {
  return { x: Config.BlockSize * 3, y: 0 };
}

class Element extends Updater {
  private speed!: number;
  position!: Point;
  data!: Source;
  private segments!: Segment[];
  positions!: Point[];
  points!: Point[];

  constructor() {
    super();

    this.initial();
  }

  private initial() {
    this.segments = [];
    this.speed = Config.BlockSize;

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
    this.position.x -= this.speed;
    this.updateSegments();
  }

  moveRight() {
    this.position.x += this.speed;
    this.updateSegments();
  }

  private updatePosition() {
    this.position.y += this.speed;
  }

  private updateSegments() {
    const { data, position } = this;

    const rects = createRects(data, position);
    const newSegments = createRectsSegments(rects);

    this.positions = createPosition(this.data);
    this.points = createPoints(this.positions, this.position);
    this.segments = newSegments;
  }

  update(timestamp: number) {
    super.updateTimestamp(timestamp);

    if (this.updateStatus) {
      this.updateData();
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
