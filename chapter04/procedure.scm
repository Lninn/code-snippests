(define (primitive-procedure? p)
	(tagged-list? p 'primitive))

(define (primitive-implementation p)
	(cadr p))

(define (apply-primitive-procedure p args)
	(apply-in-underlying-scheme
	 (primitive-implementation p) args))


(define (make-procedure parameters body env)
  (list 'procedure parameters body env))

(define (compound-procedure? p)
	(tagged-list? p 'procedure))

(define (procedure-parameters p)
	(cadr p))

(define (procedure-body p)
	(caddr p))

(define (procedure-env p)
	(cadddr p))