;1 * 1 = 1
;1 * 2 = 2 2 * 2 = 4
;1 * 3 = 3 2 * 3 = 6 3 * 3 = 9


(define display2
   (lambda (n)
      (display n)
      (if (<= n 9)
         (display " "))))


(define log
   (lambda (a b)
      (display b)
      (display "*")
      (display a)
      (display "=")
      (display2 (* a b))
      (display "  ")))


(define col
   (lambda (row n)
      (if (<= n row)
         (log row n))
      (if (<= n row)
         (col row (+ n 1)))))


(define row
   (lambda (n)
      (col n 1)
      (newline)
      (if (<= n 8)
         (row (+ n 1)))))

(define mul
   (lambda ()
      (row 1)))


(mul)