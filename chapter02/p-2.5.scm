(load "../utils/expt.scm")

(define (cons a b)
  (* (fast-expt 2 a) (fast-expt 3 b)))

; 根据基本算术定理，每个正整数都可以被分解为唯一的素数相乘序列
(define (car z)
  (if (= (remainder z 2) 0)
      (+ 1 (car (/ z 2)))
      0))

(define (cdr z)
  (if (= (remainder z 3) 0)
      (+ 1 (car (/ z 3)))
      0))