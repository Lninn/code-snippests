; make-accumulator
(define (make-accumulator result)
  (lambda (value)
    (begin (set! result (+ value result))
           result)))

(define A (make-accumulator 5))

(define B (make-accumulator 5))