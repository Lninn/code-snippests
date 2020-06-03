(define (fib n)
  (if (or (< n 0) (= n 0))
      n
      (+ (fib (- n 1))
         (fib (- n 2)))))