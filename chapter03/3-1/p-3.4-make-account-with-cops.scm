(define (make-account balance account-pass)
  
  (define count 0)

  (define (call-the-cops)
    (newline)
    (display "CALL COPS!!!"))

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

  (define (handleFail)
    (if (>= count 3)
      (call-the-cops)
      (begin (set! count (+ count 1))
             "Incorrect password")))

  (define (handle f new-pass)
    (lambda (amount)
      (if (check new-pass)
          (f amount)
          (handleFail))))

  (define (dispatch m new-pass)
    (cond ((eq? m 'withdraw) (handle withdraw new-pass))
          ((eq? m 'deposit) (handle deposit new-pass))
          (else (error "Unknow request -- MAKE-ACCOUNT"
                       m))))

  dispatch)