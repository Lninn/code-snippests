; Symbolic Differentiation

;'(+ (* (? x) (? y)) (? y))

;'(+ (* 3 x) x)
; atom? is not in a pair or null (empty)
(define (atom? x)
  (and (not (pair? x))
  (not (null? x))))

; Patterns

(define (arbitrary-constant?    pattern)
  (if (pair? pattern) (eq? (car pattern) '?c) false))

(define (arbitrary-expression?  pattern)
  (if (pair? pattern) (eq? (car pattern) '? ) false))

(define (arbitrary-variable?    pattern)
  (if (pair? pattern) (eq? (car pattern) '?v) false))

(define (variable-name pattern) (cadr pattern))

(define (make-empty-dictionary) '())

(define (extend-dictionary pat dat dictionary)
  (let ((vname (variable-name pat)))
    (let ((v (assq vname dictionary)))
      (cond ((not v)
             (cons (list vname dat) dictionary))
            ((eq? (cadr v) dat) dictionary)
            (else 'failed)))))

(define (match pattern expression dictionary)
  (cond ((and (null? pattern) (null? expression))
         dictionary)
        ((eq? dictionary 'failed) 'failed)
        ((atom? pattern)
         (if (atom? expression)
             (if (eq? pattern expression)
                 dictionary
                 'failed)
             'failed))
        ((arbitrary-constant? pattern)
         (if (constant? expression)
             (extend-dictionary pattern expression dictionary)
             'failed))
        ((arbitrary-variable? pattern)
         (if (variable? expression)
             (extend-dictionary pattern expression dictionary)
             'failed))
        ((arbitrary-expression? pattern)
         (extend-dictionary pattern expression dictionary))
        ((atom? expression) 'failed)
        (else
         (match (cdr pattern)
                (cdr expression)
                (match (car pattern)
                       (car expression)
                       dictionary)))))


(define (log info)
   (display info)
   (newline))


(define (pattern1 parameters)
   body)

(log
   (match '(+ (* (? x) (? y)) (? y)) '(+ (* 3 x) x) (make-empty-dictionary))
)