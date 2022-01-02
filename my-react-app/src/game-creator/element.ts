import {
  dataTransform,
  createRects,
  createRectsSegments,
  drawSegments,
} from "./render";
import { Source, Point, Segment, ElementKey } from "./type";
import { Config, metaSources, InitialElementKey } from "./constant";

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
  return { x: Config.BlockSize * 3, y: -Config.BlockSize };
}

class Element extends Updater {
  private key: ElementKey = InitialElementKey;
  private data: Source = [];

  private segments: Segment[];

  private position: Point;
  private speed: number;

  constructor() {
    super();

    this.updateKey(this.key);

    this.segments = [];

    this.position = getInitialPostion();
    this.speed = Config.BlockSize;
  }

  updateKey(key: ElementKey) {
    this.key = key;
    this.data = metaSources[key];
  }

  private getHeight() {
    return this.data.length * Config.BlockSize;
  }

  transform() {
    this.data = dataTransform(this.data);

    this.updateSegments();
  }

  private updatePosition() {
    const height = this.getHeight();

    const { position } = this;
    position.y += this.speed;

    if (position.y >= Config.BoardHeight - height || position.y < 0) {
      this.speed *= -1;
    }
  }

  private updateSegments() {
    const { data, position } = this;
    const rects = createRects(data, position);
    const newSegments = createRectsSegments(rects);

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
