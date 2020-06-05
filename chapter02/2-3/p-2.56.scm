(load "exp-op.scm")

(define (exponentiation? x)
  (and (pair? x) (eq? (car x) '**)))

(define (base x) (cadr x))

(define (exponent x) (caddr x))

(define (make-exponentiation b e)
  (cond ((=number? e 0) 1)
        ((=number? e 1) b)
        (else (list '** b e))))

(define (derive exp var)
  (cond ((number? exp) 0)
        ((variable? exp)
         (if (same-variable? exp var) 1 0))
        ((sum? exp)
         (make-sum (derive (addend exp) var)
                   (derive (augend exp) var)))
        ((product? exp)
         (make-sum
           (make-product (multiplier exp)
                         (derive (multiplicand exp) var))
           (make-product (derive (multiplier exp) var)
                         (multiplicand exp))))
        ((exponentiation? exp)
         (make-product
          (exponent exp)
          (make-product (make-exponentiation (base exp) (- (exponent exp) 1))
                        (derive (base exp) var))))
        (else
         (error "unknow expression type -- DERIV" exp))))