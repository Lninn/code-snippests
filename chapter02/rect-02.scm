(load "segment.scm")

(define (make-rect original horizontal vertical)
  (cons original (cons horizontal vertical)))

(define (rect-original rect)
  (car rect))

(define (rect-horizontal rect)
  (car (cdr rect)))

(define (rect-vertical rect)
  (cdr (cdr rect)))

(define (width-of-rect rect)
  (distance (rect-original rect)
            (rect-horizontal rect)))

(define (height-of-rect rect)
  (distance (rect-original rect)
            (rect-vertical rect)))
