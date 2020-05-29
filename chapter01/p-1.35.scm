(load "1.3.3.scm")

; 黄金分割率是变换 x → 1 + 1/x 的不动点
(define f
  (lambda ()
    (fixed-point (lambda (y) (+ 1 (/ 1 y)))
                  1.0)))