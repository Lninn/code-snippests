; 逐步逼近法求平方根值

; 1 为了求 x 的平方根值，假定一个猜测值 guess 1.0
; 2 然后计算 guess 是否足够好，如果 guess 在误差允许的范围内，则返回 guess
; 3 否则，继续改进 guess 值，返回步骤 2


(define (debug guess x)
  (display "guess ")
  (display guess)
  (display ", x ")
  (display x)
  (newline))

(define (average x y) (/ (+ x y) 2))

(define (good-enough? guess x)
  (< (abs (- (square guess) x)) 0.001))

(define (improve guess x)
  (average guess (/ x guess)))

(define (sqrt-iter guess x)
  (debug guess x)
  (if (good-enough? guess x)
      guess
      (sqrt-iter (improve guess x)
                 x)))

(define (sqrt x)
  (sqrt-iter 1.0 x))