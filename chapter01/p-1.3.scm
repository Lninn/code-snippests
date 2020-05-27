(define (is-min n m1 m2)
  (and (< n m1) (< n m2)))

(define (sum-of-two-max a b c)
  (cond ((is-min a b c) (+ b c))
        ((is-min b a c) (+ a c))
        ((is-min c a b) (+ a b))))