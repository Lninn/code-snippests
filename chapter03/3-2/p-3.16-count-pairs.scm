(define (count-pairs x)
  (if (not (pair? x))
      0
      (+ (count-pairs (car x))
         (count-pairs (cdr x))
         1)))

(define l1 (cons 1 (cons 2 (cons 3 '()))))

(define x (cons 2 '()))
(define y (cons 1 x))
(define l2 (cons x y))

(define x (cons 1 '()))
(define y (cons x x))
(define l3 (cons y y))