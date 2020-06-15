; count-pairs
(define (count-pairs x)
  (define (iter items store)
    (if (and (pair? items)
             (false? (memq items store)))
        (iter (car items)
              (iter (cdr items)
                    (cons items store)))
        store))
 (length (iter x '())))

(define x (cons 1 '()))
(define y (cons x x))
(define l1 (cons y y))