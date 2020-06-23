; from left to right
(define (list-of-values exps env)
  (if (no-operands? exps)
      '()
      (let ((value (eval (first-operand exps) env)))
        (cons value
              (list-of-values (rest-operands exps) env)))))

; from right to left
(define (list-of-values exps env)
  (if (no-operands? exps)
      '()
      (let ((rest (list-of-values (rest-operands exps) env)))
        (cons (eval (first-operand exps) env))
              rest)))