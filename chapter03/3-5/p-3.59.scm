(load "display-stream.scm")
(load "integers-starting-from.scm")
(load "mul-stream.scm")

(define integers (integers-starting-from 1))

(define rats (stream-map (lambda (x) (/ 1 x)) integers))

(define (integrate-series s)
  (mul-stream s rats))

(define exp-series
  (cons-stream 1 (integrate-series exp-series)))

(define cosine-series
  (cons-stream 1 (integrate-series sine-series)))

(define sine-series
  (cons-stream 0 (integrate-series cosine-series)))