import { ELEMENT_BOX_SIZE } from "../config"
import { CornerProps, RectProps } from "./element"
import { Line } from "./line"
import { Point } from "./point"

export type Segment = [Point, Point]

export const enum Placement {
  TopLeft,
  LeftTop,

  Top,

  TopRight,
  RightTop,

  Right,

  RightBottom,
  BottomRight,

  Bottom,

  LeftBottom,
  BottomLeft,

  Left,
}

export const createRectList = (
  center: Point,
  corner: CornerProps,
) => {

  const gap = ELEMENT_BOX_SIZE
  const rectSize = gap * 2

  const { top, right, bottom, left } = corner

  const tl: RectProps = {
    x: left - rectSize,
    y: top -rectSize,
    width: rectSize,
    height: rectSize,
    placement: Placement.TopLeft,
  }

  const t: RectProps = {
    x: center.x - gap,
    y: top -rectSize,
    width: rectSize,
    height: rectSize,
    placement: Placement.Top,
  }

  const tr: RectProps = {
    x: right,
    y: top -rectSize,
    width: rectSize,
    height: rectSize,
    placement: Placement.TopRight,
  }

  const r: RectProps = {
    x: right,
    y: center.y - gap,
    width: rectSize,
    height: rectSize,
    placement: Placement.Right,
  }

  const br: RectProps = {
    x: left - rectSize,
    y: bottom,
    width: rectSize,
    height: rectSize,
    placement: Placement.TopLeft,
  }

  const b: RectProps = {
    x: center.x - gap,
    y: bottom,
    width: rectSize,
    height: rectSize,
    placement: Placement.Bottom,
  }

  const bl: RectProps = {
    x: right,
    y: bottom,
    width: rectSize,
    height: rectSize,
    placement: Placement.BottomLeft,
  }

  const l: RectProps = {
    x: left - rectSize,
    y: center.y - gap,
    width: rectSize,
    height: rectSize,
    placement: Placement.Left,
  }

  return [
    tl,
    t,
    tr,
    r,
    br,
    b,
    bl,
    l,
  ]

}

export const createSegmentList = (
  corner: CornerProps,
) => {
  const gap = ELEMENT_BOX_SIZE

  const { top, right, bottom, left } = corner

  const lineList: Pick<Line, 'start' | 'end'>[] = [
    {
      start: { x: left, y: top - gap },
      end: { x: right, y: top - gap },
    },
    {
      start: { x: right + gap, y: top },
      end: { x: right + gap, y: bottom },
    },
    {
      start: { x: left, y: bottom + gap },
      end: { x: right, y: bottom + gap },
    },
    {
      start: { x: left - gap, y: top },
      end: { x: left - gap, y: bottom },
    },
  ]

  const segmentList: Segment[] = []
  for (let i = 0; i < lineList.length; i++) {
    const {
      start,
      end,
    } = lineList[i]

    const createCenterSegment = () => {
      if (i % 2 === 0) {
        const width = right - left
        const interval = width / 2 - gap
        const c1: Point = { x: start.x + interval, y: start.y }
        const c2: Point = { x: end.x - interval, y: start.y }

        return [c1, c2]
      } else {
        const height = bottom - top
        const interval = height / 2 - gap
        const c1: Point = { x: start.x, y: start.y + interval }
        const c2: Point = { x: start.x, y: end.y - interval }

        return [c1, c2]
      }
    }

    const [c1, c2] = createCenterSegment()

    const prev: Segment = [start, c1]
    const next: Segment = [c2, end]

    segmentList.push(prev)
    segmentList.push(next)
  }

  return segmentList
}
