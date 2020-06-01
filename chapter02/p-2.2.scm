(load "segment.scm")

(define s1
  (make-segment (make-point -3 5)
                (make-point 8 -1)))

(print-point (midpoint-segment s1))

(define len
  (distance (make-point 3 2)
            (make-point 9 7)))

(newline)
(display len)