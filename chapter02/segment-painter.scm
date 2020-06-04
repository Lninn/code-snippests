(load "segment.scm")
(load "frame-coord-map.scm")

(define (segment->painter segment-list)
  (lambda (frame)
    (for-each
     (draw-line
      ((frame-coord-map frame) (start-segment segment))
      ((frame-coord-map frame) (end-segment segment)))
     segment-list)))