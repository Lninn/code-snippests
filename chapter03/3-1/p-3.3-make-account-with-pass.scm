(define (make-account balance account-pass)
  
  (define (withdraw amount)
    (if (>= balance amount)
        (begin (set! balance (- balance amount))
               balance)
        "Insufficient funds"))
  
  (define (deposit amount)
    (set! balance (+ balance amount))
    balance)

  (define (check new-pass)
    (eq? account-pass new-pass))

  (define (handle f new-pass)
    (lambda (amount)
      (if (check new-pass)
          (f amount)
          "Incorrect password")))

  (define (dispatch m new-pass)
    (cond ((eq? m 'withdraw) (handle withdraw new-pass))
          ((eq? m 'deposit) (handle deposit new-pass))
          (else (error "Unknow request -- MAKE-ACCOUNT"
                       m))))

  dispatch)