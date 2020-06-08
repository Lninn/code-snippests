(load "p-2.56.scm")

(define (augend s)
  (cond ((not (pair? s)) s)
        ((= 3 (length s)) (caddr s))
        (else
         (append (list '+) (cddr s)))))

(define (multiplicand p)
  (cond ((not (pair? p)) p)
        ((= 3 (length p)) (caddr p))
        (else
         (append (list '*) (cddr p)))))