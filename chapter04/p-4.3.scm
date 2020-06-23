(define (eval exp env)
  (cond ((self-evaluating? exp) exp)
        ((variable? exp) (lookup-variable-value exp env))
        ((quoted? exp) (text-of-quotation exp))
        (else
         ((get 'eval (car exp)) exp env))))


(define (self-evaluating? exp)
  (cond ((number? exp) true)
        ((string? exp) true)
        (else false)))

(define (variable? exp) (symbol? exp))

(define (quoted? exp) (tagged-list? exp 'quote))

(define (text-of-quotation exp) (cadr exp))


; 赋值
(define (install-assignment-package)
  (define (assignment-variable exp) (cadr exp))
  
  (define (assignment-value exp) (caddr exp))
  
  (define (eval-assignment exp env)
    (set-variable-value! (assignment-variable exp)
                         (eval (assignment-value exp) env)
                         env))

  (put 'eval 'assignment eval-assignment)
  'ok)


; 定义
(define (install-definition-package)
  (define (definition-variable exp)
    (if (symbol? (cadr exp))
        (cadr exp)
        (caadr exp)))  ; 过程名称

  (define (definition-value exp)
    (if (symbol? (cadr exp))
        (caddr exp)
        (make-lambda (cdadr exp)   ; formal parameters
                     (cddr exp)))) ; body

  (define (eval-definition exp env)
    (define-variable! (definition-variable exp)
                      (eval (definition-value exp) env)
                      env)
    'ok)
  
  (put 'eval 'define eval-definition)
  'ok)


; 条件判断
(define (install-if-package)
  (define (if-predicate exp) (cadr exp))

  (define (if-consequent exp) (caddr exp))

  (define (if-alternative exp)
    (if (not (null? (cadddr exp)))
        (cadddr exp)
        'false))
  
  (define (eval-if exp env)
    (if (true? (eval (if-predicate exp) env))
        (eval (if-consequent exp) env)
        (eval (if-alternative exp) env)))

  (put 'eval 'if eval-if)
  'ok)

(define (make-if predicate consequent alternative)
  (list 'if predicate consequent alternative))


; lambda 表达式
(define (install-lambda-package)
  (define (lambda-parameters exp) (cadr exp))

  (define (lambda-body exp) (cddr exp))

  (define (eval-lambda exp env)
    (make-procedure (lambda-parameters exp)
                    (lambda-body exp)
                    env))

  (put 'eval 'lambda eval-lambda)
  'ok)

(define (make-lambda parameters body)
  (cons 'lambda (cons parameters body)))

 
; begin 表达式
(define (install-begin-package)
  (define (begin-actions exp) (cdr exp))

  (define (last-exp? seq) (null? (cdr seq)))

  (define (first-exp seq) (car seq))

  (define (rest-exps seq) (cdr seq))

  (define (sequence->exp seq)
    (cond ((null? seq) seq)
          ((last-exp? seq) (first-exp seq))
          (else (make-begin seq))))

  (define (eval-sequence exps env)
    (cond ((last-exp? exps) (eval (first-exp exps) env))
          (else (eval (first-exp exps) env)
                (eval-sequence (rest-exps exps) env))))

  (define (eval-begin exp env)
    (eval-sequence (begin-actions exp) env))

  (put 'eval 'begin eval-begin)
  (put 'eval 'sequence->exp sequence->exp)
  'ok)

(define (make-begin seq) (cons 'begin seq))


; 分情况分析
(define (install-cond-package)
  (define sequence->exp (get 'eval 'sequence->exp))

  (define (cond-clauses exp) (cdr exp))

  (define (cond-else-clause? clause)
    (eq? (cond-predicate clause) 'else))

  (define (cond-predicate clause) (car clause))

  (define (cond-actions clause) (cdr clause))

  (define (cond->if exp)
    (expand-clauses (cond-clauses exp)))

  (define (expand-clauses clauses)
    (if (null? clauses)
        'false
        (let ((first (car clauses))
              (rest (cdr clauses)))
          (if (cond-else-clause? first)
              (if (null? rest)
                  (sequence->exp (cond-actions first))
                  (error "ELSE clause isn't last -- COND-IF"
                         clauses))
              (make-if (cond-predicate first)
                       (sequence->exp (cond-actions first))
                       (expand-clauses rest))))))

  (define (eval-cond exp env)
    (eval (cond->if exp) env))
  
  (put 'eval 'cond eval-cond)
  'ok)


#|
复合表达式
(set! name "join")

(define a 123)

(+ 1 2 3)

(sqrt (+ 1 2))
|#
(define (install-application-package)
  (define (operator exp) (car exp))

  (define (operands exp) (cdr exp))

  (define (no-operands? ops) (null? ops))

  (define (first-operand ops) (car ops))

  (define (rest-operands ops) (cdr ops))

  (define (list-of-values exps env)
    (if (no-operands? exps)
        '()
        (cons (eval (first-operand exps) env)
              (list-of-values (rest-operands exps) env))))

  (define (eval-application exp env)
    (apply (eval (operator exp) env)
           (list-of-values (operands exp) env)))
  
  )


