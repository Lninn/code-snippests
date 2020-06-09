(define (deriv exp var)
  (cond ((number? exp) 0)
        ((variable? exp) (if (same-variable? exp var) 1 0))
        (else ((get 'deriv (operator exp)) (operands exp) var))))

(define (operator exp) (car exp))

(define (operands exp) (cdr exp))

;
(define (install-sum)
  (define (sum exp var)
    (make-sum (deriv (car exp) var)
              (deriv (cdr exp) var)))
  (put 'deriv '+ sum))

(define (install-product)
  (define (product exp var)
    (make-sum
           (make-product (cdr exp)
                         (derive (car exp) var))
           (make-product (derive (cdr exp) var)
                         (car exp))))
 (put 'deriv '* product) )

; P145