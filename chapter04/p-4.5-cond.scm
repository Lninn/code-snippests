(define (cond=>? exp)
  (eq? (cadr exp) '=>))

(define (prdicate exp) (car exp))

(define (then-clause exp)
  (caddr exp))

(define (eval-cond=> exp env)
  (let ((value (eval (prdicate exp) env))
        (p (then-clause exp)))
    (if (not (false? value))
        (p value)
        false)))