(load "../utils.scm")

(define (sqrt x)
   (fixed-point
      (lambda (y) (/ x y))
      1))