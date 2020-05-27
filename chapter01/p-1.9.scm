(define (inc n) (+ n 1))

(define (dec n) (- n 1))

; 过程实现 a + b
; 这是一个递归过程，产生一个线性递归计算过程，其递归计算的规模正比于 a
(define (add-1 a b)
  (if (= a 0)
      b
      (inc (add-1 (dec a) b))))

; 过程实现 a + b
; 这是一个递归过程，产生一个线性迭代计算过程
(define (add-2 a b)
  (if (= a 0)
      b
      (add-2 (dec a) (inc b))))