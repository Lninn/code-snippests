(define (true? x)
  (not (eq? x false)))

(define (false? x)
	(eq? x false))

(define (setup-environment)
  (let ((initial-env
    (extend-environment (primitive-procedure-names)
                        (primitive-procedure-objects)
                        the-empty-environment)))
    (define-variable! 'true true initial-env)
    (define-variable! 'false false initial-env)
    initial-env))

(define primitive-procedures
  (list (list 'car car)
        (list 'cdr cdr)
        (list 'cons cons)
        (list '> >)
        (list '< <)
        (list '= =)
        (list '- -)
        (list 'null? null?)))

(define (primitive-procedure-names)
  (map car
       primitive-procedures))

(define (primitive-procedure-objects)
  (map (lambda (p) (list 'primitive (cadr p)))
       primitive-procedures))

(define global (setup-environment))

; (driver-loop)

; (define (append x y)
;   (if (null? x)
;       y
;       (cons (car x) (append (cdr x) y))))

; (define (append x y) (if (null? x) y (cons (car x) (append (cdr x) y))))