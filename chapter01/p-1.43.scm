(define (compose f g)
  (lambda (x)
    (f (g x))))

(define (repeated f n)
  (define (loop times result)
    (if (= times 0)
        result
        (loop (- times 1)
              ((compose (lambda (x) x) f) result))))
  (define (try x)
    (loop n x))
  try)

((repeated square 5) 2)