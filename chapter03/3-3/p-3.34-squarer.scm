(load "constraint-system.scm")

(define (squarer a b)
  (multiplier a a b))

(define a (make-connector))
(define b (make-connector))

(probe 'a a)
(probe 'b b)

(squarer a b)