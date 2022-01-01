import {
  dataTransform,
  createRects,
  createRectsSegments,
  drawSegments,
} from "./render";
import { Source, Point, Segment, ElementKey } from "./type";
import { Config, metaSources, InitialElementKey } from "./constant";

function getInitialPostion(): Point {
  return { x: Config.BlockSize * 3, y: -Config.BlockSize };
}

class Element {
  private key: ElementKey = InitialElementKey;
  private data: Source = [];

  private segments: Segment[];

  private position: Point;
  private speed: number;

  constructor() {
    this.updateKey(this.key);

    this.segments = [];

    this.position = getInitialPostion();
    this.speed = Config.BlockSize;
  }

  updateKey(key: ElementKey) {
    this.key = key;
    this.data = metaSources[key];
  }

  getHeight() {
    return this.data.length * Config.BlockSize;
  }

  transform() {
    this.data = dataTransform(this.data);

    this.updateSegments();
  }

  updatePosition() {
    const height = this.getHeight();

    const { position } = this;
    position.y += this.speed;

    if (position.y >= Config.BoardHeight - height || position.y < 0) {
      this.speed *= -1;
    }
  }

  updateSegments() {
    const { data, position } = this;
    const rects = createRects(data, position);
    const newSegments = createRectsSegments(rects);

    this.segments = newSegments;
  }

  update() {
    this.updatePosition();
    this.updateSegments();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { segments } = this;

    drawSegments(ctx, segments);
  }
}

export { Element };
