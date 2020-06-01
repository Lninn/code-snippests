(load "interval.scm")

(define (interval-width i)
  (/ (- (upper-bound i) (lower-bound i)) 2.0))

(define (width-accumulated? combin interval1 interval2)
  (let ((w1 (interval-width interval1))
        (w2 (interval-width interval2))
        (combined-width (interval-width (combin interval1 interval2))))
    (= combined-width (+ w1 w2))))

(define r1 (make-interval 6.12 7.48))

(define r2 (make-interval 4.47 4.93))