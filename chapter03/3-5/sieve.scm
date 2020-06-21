(load "stream.scm")
(load "infinite-stream.scm")

(define (divisible? x y)
  (= (remainder x y) 0))

(define (sieve stream)
  (cons-stream
    (stream-car stream)
    (sieve (stream-filter
             (lambda (x)
               (not (divisible? x (stream-car stream))))
             (stream-cdr stream)))))

(define primes (sieve (integers-starting-from 2)))

; (integers-starting-from 2)
; => (cons-stream 2 (delay <exp>))

; (sieve (cons-stream 2 (delay <exp>)))
; => (cons-stream 2 (delay (stream-filter f <exp>)))
