; eval and

(define (begin-actions exp) (cdr exp))

(define (last-exp? seq) (null? (cdr seq)))

(define (first-exp seq) (car seq))

(define (rest-exps seq) (cdr seq))


(define (and? exp) (tagged-list? exp 'and))

(define (eval-and exp env)
  (define (iter exp)
    (cond ((last-exp? exp)
           (eval (first-exp exp) env))
          (else
           (let ((value (eval (first-exp exp) env)))
             (if (not (false? value))
                 (iter (rest-exp exp))
                 false)))))

  (if (null? exp) true (iter (cdr exp))))


(define (or? exp) (tagged-list? exp 'or))

(define (eval-or exp env)
  (define (iter exp)
    (cond ((last-exp? exp)
           (eval (first-exp exp) env))
          (else
           (let ((value (eval (first-exp exp) env)))
             (if (not (false? value))
                 value
                 (iter (rest-exp exp)))))))

  (if (null? exp) false (iter (cdr exp))))


#|
派生表达式
and
(and (> 2 1) (even? 3) (prime? 213) (+ 12 323))

(if (> 2 1)
    (if (even? 3)
        (if (prime? 123)
            (+ 12 323)
            false)
        false)
    false)
|#

(define (eval-and exp env)
  
  (define (iter exp)
    (if (null? exp)
        'true
        (let ((f (first-exp exp))
              (r (rest-exp exp)))
          (if (last-exp? exp)
              (eval f env)
              (make-if (eval f env)
                       (iter r)
                       'false)))))

  (iter (cdr exp)))

#|
or
(or a b c)

(if a
    a
    (if b
        b
        (if c
            c
            false)))
|#

(define (eval-or exp env)
  
  (define (iter exp)
    (if (null? exp)
        'false
        (let ((f (first-exp exp))
              (r (rest-exp exp)))
          (make-if (eval f env)
                   (eval f env)
                   (iter r)))))

  (iter (cdr exp)))