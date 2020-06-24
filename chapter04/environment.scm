#|
将环境简单的实现为由一系列框架组成的列表，当前框架排在最前面，越往后表示越远。
每一个框架由该框架里的所有约束变量和对应的值组成，具体方式就每个框架维护一个
cons 序对，器 car 指向由 约束变量名 组成的表，cdr 由对应变量名的 值 组成的表。
|#

#|
- (lookup-variable-value <var> <env>)
  返回符号 <var> 在环境 <env> 里的约束值，如果没有找到就报错

- (extend-environment <variables> <values> <base-env>)
  返回一个新环境
  这个环境里包含了一个新框架，其中的所有位于表 <variables> 里
  的符号约束到表 <values> 对应的元素，其外围环境是 <base-env>

- (define-variable! <var> <value> <env>)
  在环境 env 里的第一个框架里加入一个新约束，它关联起 <var> 和 <val>

- (set-variable-value! <var> <value> <env>)
  修改变量 <var> 在环境 env 里的约束，使得该变量现在约束到值 <val>
  如果这一变量没有约束就报错
|#


; 环境的表示
(define (enclsoing-environment env) (cdr env))
(define (first-frame env) (car env))
(define the-empty-environment '())

; 框架的表示
(define (make-frame variables values)
  (cons variables values))
(define (frame-variables frame) (car frame))
(define (frame-values frame) (cdr frame))
(define (add-binding-to-frame! var val frame)
  (set-car! frame (cons var (car frame)))
  (set-cdr! frame (cons val (cdr frame))))


(define (extend-environment vars vals base-env)
  (if (= (length vars) (length vals))
      (cons (make-frame vars vals) base-env)
      (if (< (length vars) (length vals))
          (error "Too many arguments supplied" vars vals)
          (error "Too few arguments supplied" vars vals))))

(define (lookup-variable-value var env)
  (define (env-loop env)
    (define (scan vars vals)
      (cond ((null? vals)
             (env-loop (enclsoing-environment env)))
            ((eq? var (car vars))
             (car vals))
            (else
             (scan (cdr vars) (cdr vals)))))
    (if (eq? env the-empty-environment)
        (error "Unbound variable" var)
        (let ((frame (first-frame env)))
          (scan (frame-variables frame)
                (frame-values frame)))))
  (env-loop env))

(define (set-variable-value! var val env)
  (define (env-loop env)
    (define (scan vars vals)
      (cond ((null? vals)
             (env-loop (enclsoing-environment env)))
            ((eq? var (car vars))
             (set-car! vals val))
            (else
             (scan (cdr vars) (cdr vals)))))
    (if (eq? env the-empty-environment)
        (error "Unbound variable -- SET" var)
        (let ((frame (first-frame env)))
          (scan (frame-variables frame)
                (frame-values frame)))))
  (env-loop env))

(define (define-variable! var val env)
  (let ((frame (first-frame env)))
    (define (scan vars vals)
      (cond ((null? vars)
             (add-binding-to-frame! var val frame))
            ((eq? var (car vars))
             (set-car! vals val))
            (else
             (scan (cdr vars) (cdr vals)))))
    (scan (frame-variables frame)
          (frame-values frame))))