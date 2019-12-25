(load "../utils.scm")

(define (sum term a next b)
   (if (> a b)
      0
      (+ (term a)
         (sum term (next a) next b))))


(define (sum-int a b)
   (define identity
      (lambda (x) x))
   (define next
      (lambda (x) (+ x 1)))
   (sum identity a next b))


(define (sum-sq a b)
   (define identity
      (lambda (x) (* x x)))
   (define next
      (lambda (x) (+ x 1)))
   (sum identity a next b))


(define (sum-pi a b)
   (define identity
      (lambda (x) (/ 1 (* a (+ a 2)))))
   (define next
      (lambda (x) (+ x 4)))
   (sum identity a next b))   


(log (sum-int 1 5))
(log (sum-sq 1 5))
(log (exact->inexact (sum-pi 1 5)))