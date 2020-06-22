(load "display-stream.scm")
(load "p-3.59.scm")

(define (mul-series s1 s2)
  (cons-stream (* (stream-car s1) (stream-car s2))
               (add-stream (stream-cdr s1) (stream-cdr s2))))

(define ret (mul-series sine-series cosine-series))