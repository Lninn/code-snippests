(load "../utils.scm")

; 求和从 A 到 B 的整数
(define (sum-int a b)
   (if (> a b)
      0
      (+ a
         (sum-int (+ a 1) b))))


(define (sum-sq a b)
   (if (> a b)
      0
      (+ (* a a)
         (sum-sq (+ a 1) b))))


(define (sum-pi a b)
   (if (> a b)
      0
      (+ (/ 1 (* a (+ a 2)))
         (sum-pi
            (+ a 4)
            b))))


(log (sum-int 1 5))
(log (sum-sq 1 5))
(log (exact->inexact (sum-pi 1 5)))
