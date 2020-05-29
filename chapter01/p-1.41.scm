(define (inc x) (+ x 1))

(define (double p)
  (lambda (x)
    (p (p x))))

; output 21
(((double (double double)) inc) 5)