(define (sum term a next b)
  (define (iter a result)
    (if (> a b)
        result
        (iter (next a)
              (+ result (term a)))))
  (iter a 0))

; Test
(define (sum-cubes a b)
  (define (inc x) (+ x 1))
  (sum cube a inc b))