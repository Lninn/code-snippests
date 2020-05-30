; Gcd
(define (gcd a b)
  (if (= a 0)
      b
      (gcd b (remainder a b))))