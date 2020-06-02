(define (same-type a b)
  (or (and (even? a) (even? b))
      (and (odd? a) (odd? b))))

(define (same-parity . items)
  (let ((first (car items)))
    (define try
      (lambda (items)
        (cond ((null? items) '())
              ((same-type first (car items))
               (cons (car items)
                          (try (cdr items))))
              (else (try (cdr items)))))) 
    (try items)))
