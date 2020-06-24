#|
将 frame 表示为一个表，其中每个约束是一个 名字-值 序对

修改 frame 的表示
|#

; 环境的表示
(define (enclsoing-environment env) (cdr env))
(define (first-frame env) (car env))
(define the-empty-environment '())

; 框架的表示
(define (make-frame variables values)
  (if (null? variables)
      '()
      (cons (cons (car variables) (car values))
            (make-frame (cdr variables) (cdr values)))))

(define (first-bind frame) (car frame))

(define (nest-bind frame) (cdr frame))

(define (add-binding-to-frame! var val frame)
  (cons (cons var val)
        frame))


(define (extend-environment vars vals base-env)
  (if (= (length vars) (length vals))
      (cons (make-frame vars vals) base-env)
      (if (< (length vars) (length vals))
          (error "Too many arguments supplied" vars vals)
          (error "Too few arguments supplied" vars vals))))

(define (lookup-variable-value var env)
  (define (env-loop env)
    (define (scan frame)
      (cond ((null? frame)
             (env-loop (enclsoing-environment env)))
            ((eq? var (car (first-bind frame)))
             (cdr (first-bind frame)))
            (else
             (scan (nest-bind frame)))))
    (if (eq? env the-empty-environment)
        (error "Unbound variable" var)
        (scan (first-frame env))))
  (env-loop env))

(define (set-variable-value! var val env)
  (define (env-loop env)
    (define (scan frame)
      (cond ((null? frame)
             (env-loop (enclsoing-environment env)))
            ((eq? var (car (first-bind frame)))
             (set-cdr! (first-bind frame) val))
            (else
             (scan (nest-bind frame)))))
    (if (eq? env the-empty-environment)
        (error "Unbound variable -- SET" var)
        (scan (first-frame env))))
  (env-loop env))

(define (define-variable! var val env)
  (let ((frame (first-frame env)))
    (define (frame)
      (cond ((null? frame)
             (add-binding-to-frame! var val frame))
            ((eq? var (car (first-bind frame)))
             (set-car! (first-bind frame) val))
            (else
             (scan (nest-bind frame)))))
    (scan frame)))