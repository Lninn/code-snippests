(load "operation-system.scm")

(define (=zero? x)
  (apply-generic '=zero? x))