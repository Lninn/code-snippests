; celsius-fahrenheit-converter

(load "constraint-system.scm")

(define (c+ x y)
  (let ((z (make-connector)))
    (adder x y z)
    z))

(define (c- x y)
  (let ((z (make-connector)))
    (adder z y x)
    z))

(define (c* x y)
  (let ((z (make-connector)))
    (multiplier x y z)
    z))

(define (c/ p q)
    (let ((r (make-connector)))
        (multiplier q r p)
        r))

(define (cv value)
  (let ((z (make-connector)))
    (constant value z)
    z))

(define (celsius-fahrenheit-converter x)
  (c+ (c* (c/ (cv 9) (cv 5))
          x)
      (cv 32)))

(define C (make-connector))

(define F (celsius-fahrenheit-converter C))

(probe 'C C)

(probe 'F F)