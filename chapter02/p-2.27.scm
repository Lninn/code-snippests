(define (deep-reverse items)
  (define (reverse-iter a result)
    (if (null? a)
        result
        (let ((first (car a)))
          (reverse-iter (cdr a)
                        (cons (if (pair? first)
                                  (deep-reverse first)
                                  first)
                              result)))))
  (reverse-iter items '()))

(define x (list (list 1 2) (list 3 4 5)))

(deep-reverse x)