; 杨辉三角

(define (pascal-recursion m n)
  (cond ((or (= n 0) (= m n)) 0)
        (else (+ (pascal (- m 1) (- n 1))
                 (pascal (- m 1) n)))))

(define (pascal row)
  (pascal-recursion row 0))