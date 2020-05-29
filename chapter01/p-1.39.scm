(load "p-1.37.scm")

(define (N x)
  (lambda (i)
    (if (= i 1)
        x
        (- (square x)))))

(define (D i)
  (if (= i 1)
      1
      (+ i (- i 1))))

(define tan-cf
  (lambda (x k)
    (exact->inexact (cont-frac (N x)
                               D
                               k))))