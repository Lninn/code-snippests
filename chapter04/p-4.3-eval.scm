(load "table.scm")

(define (operation-table) (make-table))

(define get (operation-table 'lookup-proc))

(define put (operation-table 'insert-proc!))


(define (eval exp env)
  (cond ((self-evaluating? exp) exp)
        ((quoted? exp) (text-of-quotation exp))
        ((variable? exp) (lookup-variable-value exp env))
        (else
         ((get 'eval (car exp)) exp env))))


(define (install-assignment)
  (define (assignment-variable exp) (cadr exp))

  (define (assignment-value exp) (caddr exp))
  
  (define (eval-assignment exp env)
    (set-variable-value! (assignment-variable exp)
                         (eval (assignment-value exp) env)
                         env))
  
  (put 'eval 'set! eval-assignment)
  'ok)


(define (install-definition)
  (define (definition-variable exp)
    (if (symbol? (cadr exp))
        (cadr exp)
        (caadr exp)))

  (define (definition-value exp)
    (if (symbol? (cadr exp))
        (caddr exp)
        (make-lambda (cdadr exp)   ; formal parameters
                     (cddr exp)))) ; body
  
  (define (eval-definition exp env)
    (define-variable! (definition-variable exp)
                      (eval (definition-value exp) env)
                      env))
  
  (put 'eval 'define eval-definition)
  'ok)


(define (install-if)
  (define (if-predicate exp) (cadr exp))

  (define (if-consequent exp) (caddr exp))

  (define (if-alternative exp)
    (if (not (null? (cadddr exp)))
        (cadddr exp)
        'false))

  (define (make-if predicate consequent alternative)
    (list 'if predicate consequent alternative))

  (define (eval-if exp env)
    (if (true? (eval (if-predicate exp) env))
        (eval (if-consequent exp) env)
        (eval (if-alternative exp) env)))
  
  (put 'eval 'if eval-if)
  (put 'eval 'make-if make-if)
  'ok)