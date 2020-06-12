(define (count-pairs x)
  (if (not (pair? x))
      0
      (+ (count-pairs (car x))
         (count-pairs (cdr x))
         1)))

(define l1 (cons 1 (cons 2 (cons 3 '()))))

(define l2 (cons (cons (cons '() 1) 2) 3))

(define l3
  (cons (cons 1 2) (cons 3 4)))