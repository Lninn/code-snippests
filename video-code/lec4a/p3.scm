;pattern '(+ (* (? x) (? y)) (? y))
;expression '(+ (* 3 x) x)

;调试
(define (log a b)
   (define print
      (lambda (x)
         (display x)
         (display " ")))
   (if (not (null? a))
      (print a))
   (if (not (null? b))
      (print b))
   (newline))


; 空字典
(define (make-empty-dictionary) '())

(define (variable-name pattern) (cadr pattern))

; 向字典添加内容
(define (extend-dictionary pat dat dictionary)
  (let ((vname (variable-name pat)))
    (let ((v (assq vname dictionary)))
      (cond ((not v)
             (cons (list vname dat) dictionary))
            ((eq? (cadr v) dat) dictionary)
            (else 'failed)))))

; atom? is not in a pair or null (empty)
(define (atom? x)
  (and (not (pair? x))
  (not (null? x))))

(define (compound? exp) (pair?   exp))
(define (constant? exp) (number? exp))
(define (variable? exp) (atom?   exp))

;识别表达式
(define (arbitrary-expression?  pattern)
  (if (pair? pattern) (eq? (car pattern) '? ) false))

; 根据模式匹配表达式的内容到一个字典中
(define (match pattern expression dictionary)
   (log "pattern" pattern)
   (log "expression" expression)
   (log "dictionary" dictionary)
   (newline)
   (cond
      ((and (null? pattern) (null? expression)) dictionary)
      ((atom? pattern)
         (if (atom? expression)
            (if (eq? pattern expression)
               dictionary
               'failed)
            'failed))
      ((arbitrary-expression? pattern)
         (if (variable? expression)
            (extend-dictionary pattern expression dictionary)
            'failed))
      (else (match
               (cdr pattern)
               (cdr expression)
               (match
                  (car pattern)
                  (car expression)
                  dictionary)))))


(define p1
   '(+ (* (? x) (? y)) (? y)))

(define e1
   '(+ (* 3 x) x))

(define p2
   '(+ (* (? x) (? y)) (? y)))

(define e2
   '(+ (* 3 x) x))   

(log "start" "")

(log
   (match p1 e1 (make-empty-dictionary)) "")
