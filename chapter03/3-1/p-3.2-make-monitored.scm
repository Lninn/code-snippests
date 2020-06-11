; make-monitored
(define (make-monitored f)
  (let ((counter 0))
    
    (define (handle arg)
      (set! counter (+ counter 1))
      (f arg))
    
    (define (reset)
      (set! counter 0)
      counter)

    (define (mf arg)
      (cond ((eq? 'how-many-calls? arg) counter)
            ((eq? 'reset-count arg) (reset))
            (else (handle arg))))
    mf))

(define s (make-monitored sqrt))