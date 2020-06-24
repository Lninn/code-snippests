#|
(let ((<var1> <val1>)
      (<var2> <val2>)
      (<var3> <val3>))
  body)

((lambda (<var1> <var2> <var3>)
   body
   )
 <val1>
 <val2>
 <val3>)

|#

(define (let? exp)
  (tagged-list? 'let exp))

(define (let-parameters exp)
  (cadr exp))

(define (let-body exp)
  (caddr exp))

(define (let->combination exp env)
  (define names (list))
  (define values (list))

  (define (iter ps)
    (if (null? ps)
        '()
        (let ((name (car (car ps)))
              (value (eval (cadr (car ps)) env)))
          (set-cdr! names (cons name names))
          (set-cdr! values (cons value values))
          (iter (cdr ps)))))

  (iter (let-parameters exp))

  (list (make-lambda names (let-body exp))
        values))