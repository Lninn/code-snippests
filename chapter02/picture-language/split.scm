(load "beside.scm")
(load "below.scm")

(define (split a b)
  (define (iter painter n)
    (if (= n 0)
        painter
        (let ((smaller (iter painter (- n 1))))
          (a painter (b smaller smaller)))))
  iter)

(define right-split (split beside below))

(define up-split (split below beside))
