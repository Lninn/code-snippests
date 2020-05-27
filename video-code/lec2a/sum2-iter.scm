(load "../utils.scm")

(define (sum-iter term a next b)
   (define (iter n ans)
      (if (> n b)
         ans
         (iter
            (next n)
            (+ ans (term n)))))
   (iter a 0))


(define (sum-int a b)
   (define identity
      (lambda (x) x))
   (define next
      (lambda (x) (+ x 1)))
   (sum-iter identity a next b))


(define (sum-sq a b)
   (define identity
      (lambda (x) (* x x)))
   (define next
      (lambda (x) (+ x 1)))
   (sum-iter identity a next b))


(define (sum-pi a b)
   (define identity
      (lambda (x) (/ 1 (* a (+ a 2)))))
   (define next
      (lambda (x) (+ x 4)))
   (sum-iter identity a next b))   


(log (sum-int 1 5))
(log (sum-sq 1 5))
(log (exact->inexact (sum-pi 1 5)))   