(load "tagged-list.scm")

(define (self-evaluating? exp)
  (cond ((number? exp) true)
        ((string? exp) true)
        (else flase)))


(define (variable? exp)
  (symbol? exp))


(define (quoted? exp)
	(tagged-list exp 'quote))

(define (text-of-quotation exp)
	(cadr exp))


(define (assignment? exp)
	(tagged-list? exp 'set!))

(define (assignment-variable exp)
	(cadr exp))

(define (assignment-value exp)
	(caddr exp))


(define (definition? exp)
	(tagged-list? exp 'define))

(define (definition-variable exp)
	(if (symbol? (cadr exp))
		(cadr exp)
		(caadr exp)))

(define (definition-value exp)
	(if (symbol? (cadr exp))
		(caddr exp)
		(make-lambda (cdadr exp)
								 (cddr exp))))
								 

(define (lambda? exp)
	(tagged-list? exp 'lambda))

(define (lambda-parameters exp)
	(cadr exp))

(define (lambda-body exp)
	(cddr exp))

(define (make-lambda parameters body)
	(cons 'lambda (cons parameters body)))


(define (if? exp)
	(tagged-list? exp 'if))

(define (if-predicate exp)
	(cadr exp))

(define (if-consequent exp)
	(caddr exp))

(define (if-alternative exp)
	(if (not (null? (cdddr exp)))
		(cadddr exp)
		'false))

(define (make-if predicate consequent alternative)
	(list 'if predicate consequent alternative))


(define (begin? exp)
	(tagged-list? exp 'begin))

(define (begin-actions exp)
	(cdr exp))

(define (last-exp? exp)
	(null? (cdr exp)))

(define (first-exp exp)
  (car exp))

(define (rest-exps exp)
	(cdr exp))

(define (sequence->exp seq)
	(cond ((null? seq) seq)
				((last-exp? exp) (first-exp exp))
				(else (make-begin seq))))

(define (make-begin seq)
	(cons 'begin seq))


;; 275