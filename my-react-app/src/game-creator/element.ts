import {
  dataTransform,
  createRects,
  createRectsSegments,
  drawSegments,
} from "./render";
import { Source, Point, Segment } from "./type";
import { Config } from "./constant";

function getInitialPostion(): Point {
  return { x: Config.BlockSize * 3, y: -Config.BlockSize };
}

class Element {
  private data: Source;
  private segments: Segment[];

  private position: Point;
  private speed: number;

  constructor(data: Source) {
    this.data = data;

    this.segments = [];

    this.position = getInitialPostion();
    this.speed = Config.BlockSize;
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
