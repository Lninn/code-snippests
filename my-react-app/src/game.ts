type Source = number[][];

export type ShapeKey = "T" | "L" | "I" | "S" | "Z" | "O";

const metaSources: Record<ShapeKey, Source> = {
  T: [
    [1, 1, 1],
    [0, 1],
  ],
  L: [[1], [1], [1, 1]],
  I: [[1], [1], [1]],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
};

export const elementKeys = Object.keys(metaSources);

interface Point {
  x: number;
  y: number;
}

interface Segment {
  start: Point;
  end: Point;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function dataTransform(data: Source) {
  const rowSpan = data.length;
  const colSpan = Math.max(...data.map((dataItem) => dataItem.length));

  const newData: Source = [
    ...(Array.from({ length: colSpan }).map(() => []) as Source),
  ];

  for (let i = 0; i < rowSpan; i++) {
    for (let j = 0; j < colSpan; j++) {
      newData[j][i] = data[i][j];
    }
  }

  return newData;
}

const BlockSize = 30;
function createRect({ x, y }: Point): Rect {
  return {
    x,
    y,
    w: BlockSize,
    h: BlockSize,
  };
}

function isValidData(data: number) {
  return data === 1;
}

function createRects(data: Source, targetPoint?: Point) {
  if (!targetPoint) {
    targetPoint = { x: 0, y: 0 };
  }

  const rects: Rect[] = [];

  let x = targetPoint.x,
    y = targetPoint.y;
  for (const dataItem of data) {
    if (Array.isArray(dataItem)) {
      x = targetPoint.x;

      for (const subDataItem of dataItem) {
        const rect = createRect({ x, y });

        if (isValidData(subDataItem)) {
          rects.push(rect);
        }

        x = x + BlockSize;
      }
    }

    y = y + BlockSize;
  }

  return rects;
}

function createSegments(rect: Rect) {
  const segments: Segment[] = [];

  const { x, y, w, h } = rect;

  // 上右下左
  const rectPoints: Point[] = [
    {
      x,
      y,
    },
    {
      x: x + w,
      y,
    },
    {
      x: x + w,
      y: y + h,
    },
    {
      x,
      y: y + h,
    },
  ];

  let start: Point,
    end: Point,
    i = 0;
  for (; i < rectPoints.length; i++) {
    start = rectPoints[i];
    end = rectPoints[i + 1];

    if (!end) end = rectPoints[0];

    segments.push({
      start,
      end,
    });
  }

  return segments;
}

// top => bottom
// left => right
type SegmentOfShapeKey = "A" | "B" | "C" | "D";
const segmentOfShapeKeys: SegmentOfShapeKey[] = ["A", "B", "C", "D"];

type SegmentsMap = Record<SegmentOfShapeKey, Segment[]>;

function createSegmentsMap(rects: Rect[]) {
  const segmentsMap: SegmentsMap = {
    A: [],
    B: [],
    C: [],
    D: [],
  };

  let i = 0,
    shapeKey: SegmentOfShapeKey,
    rect: Rect,
    segments: Segment[];
  for (; i < segmentOfShapeKeys.length; i++) {
    shapeKey = segmentOfShapeKeys[i];
    rect = rects[i];
    segments = createSegments(rect);

    segmentsMap[shapeKey] = segments;
  }

  return segmentsMap;
}

function drawSegment(ctx: CanvasRenderingContext2D, { start, end }: Segment) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.closePath();
}

function drawSegmentsMap(
  ctx: CanvasRenderingContext2D,
  segmentsMap: SegmentsMap
) {
  let segments: Segment[];
  for (const shapeKey of segmentOfShapeKeys) {
    segments = segmentsMap[shapeKey];

    segments.forEach((segment) => {
      drawSegment(ctx, segment);
    });
  }
}

function createRectsSegments(rects: Rect[]) {
  const rectSegments: Segment[] = [];

  for (const rect of rects) {
    const segments = createSegments(rect);

    rectSegments.push(...segments);
  }

  return filterSegments(rectSegments);
}

function filterSegments(segments: Segment[]) {
  function createMark(segment: Segment) {
    const { start, end } = segment;

    const s1 = [start.x, start.y].join(">");
    const s2 = [end.x, end.y].join(">");

    return [[s1, s2].join(","), [s2, s1].join(",")];
  }

  const cache: string[] = [];
  const filterList: Segment[] = [];

  segments.forEach((segment) => {
    const [s1, s2] = createMark(segment);

    if (!cache.includes(s1)) {
      if (!cache.includes(s2)) {
        filterList.push(segment);

        cache.push(s1);
      }
    }
  });

  return filterList;
}

function drawSegments(ctx: CanvasRenderingContext2D, segments: Segment[]) {
  for (const segment of segments) {
    drawSegment(ctx, segment);
  }
}

const BOARD_HEIGHT = 300;

// Element
class Element {
  private data: Source;
  private segments: Segment[];

  private position: Point;
  private speed: number;

  constructor(data: Source) {
    this.data = data;

    this.segments = [];

    this.position = { x: BlockSize * 3, y: -BlockSize };
    this.speed = BlockSize;
  }

  getHeight() {
    return this.data.length * BlockSize;
  }

  transform() {
    this.data = dataTransform(this.data);

    this.updateSegments();
  }

  updatePosition() {
    const height = this.getHeight();

    const { position } = this;
    position.y += this.speed;

    if (position.y >= BOARD_HEIGHT - height || position.y < 0) {
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

let currentElement = new Element(metaSources["T"]);

function updateKey(key: ShapeKey) {
  currentElement = new Element(metaSources[key]);
}

export { updateKey, currentElement };
