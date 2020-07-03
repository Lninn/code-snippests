(define nil '())

(define (no-operands? exps)
  (null? exps))

(define (list-of-values exps env)
  (if (no-operands? exps)
      nil
      (let ((val (eval (first-exp exps) env)))
        (cons val
              (list-of-values (rest-exps exps) env)))))

(define (test exps)
  (if (no-operands? exps)
      nil
      (let ((val ((car exps))))
        (cons val
              (test (cdr exps))))))

(define (list-of-values exps env)
  (if (no-operands? exps)
      nil
      (let ((rest (rest-exp exps)))
        (cons (eval (first-exp exps))
              (list-of-values rest env)))))

(define (test exps)
  (if (no-operands? exps)
      nil
      (let ((rest (cdr exps)))
        (cons ((car exps))
              (test rest)))))

; Test
(define (a)
  (newline)
  (display 1)
  'a)

(define (b)
  (newline)
  (display 2)
  'b)

(define (c)
  (newline)
  (display 3)
  'c)

(test (list a b c))
; P273