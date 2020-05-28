(load "p-1.22.scm")

(define (prime? n)
  (fast-prime? n 10))