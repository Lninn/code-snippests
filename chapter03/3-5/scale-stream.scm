(load "integers-starting-from.scm")
(load "display-stream.scm")

(define (scale-stream s factor)
  (if (stream-null? s)
      the-empty-stream
      (cons-stream (* (stream-car s) factor)
                   (scale-stream (stream-cdr s) factor))))

#|
(define integers (integers-starting-from 1))
(define S (scale-stream integers 10))
|#
