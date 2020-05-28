; 抽象的求积过程
(define (product term a next b)
  (if (> a b)
      1
      (* (term a) (product term (next a) next b))))

; factorial
(define (factorial n)
  (define (identity x ) x)
  (define (inc x ) (+ x 1))
  (product identity 1 inc n))

; 计算 Π 的近似值
(define (pi-test n)
  (define (inc x) (+ x 1))
  (define (term x)
    (if (even? x)
        (/ x (+ x 1))
        (/ (+ x 1) x)))
  (/ (product term 2 inc n) 1.0))


; 迭代过程
(define (product term a next b)
  (define (iter a result)
    (if (> a b)
        result
        (iter (next a)
              (* result (term a)))))
  (iter a 1))