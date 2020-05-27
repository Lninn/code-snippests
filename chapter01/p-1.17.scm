; 假定语言里面没有实现乘法
; 实现一个求乘积的过程，只用对数的计算步数

; 过程参考 连续求平方的 方式

(define (double x) (+ x x))

(define (halve x) (/ x 2))

(define (fast-mul a b)
  (cond ((= b 0) 0)
        ((even? b) (double (fast-mul a
                                     (halve b))))
        (else (+ a (fast-mul a
                             (- b 1))))))