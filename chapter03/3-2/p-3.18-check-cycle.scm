; check cycle

(load "p-3.13-make-cycle.scm")

(define l1 (list 1 2 3 4))
(define l2 (make-cycle (list 1 2 3 4)))

(define (infinite? x)
  (cond ((null? x) false)
        ((eq? 'visited (car x)) true)
        (else
         (set-car! x 'visited)
         (infinite? (cdr x)))))