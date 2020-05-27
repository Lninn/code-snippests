; 加载 求平方根文件
(load "1.1.7.scm")

; 修改 good-enough?
; 监视 猜测值 从一次迭代到下一次的变化情况

(define (good-enough? old-guess new-guess)
  (< (abs (- new-guess old-guess)) 0.001))

(define (sqrt-iter guess x)
  (if (good-enough? guess (improve guess x))
      guess
      (sqrt-iter (improve guess x) x)))