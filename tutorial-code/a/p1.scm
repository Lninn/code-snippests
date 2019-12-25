(define print
    (lambda (num)
        (display num)
        (newline)))

(newline)
(print
    (*
        (+ 1 39)
        (- 53 45)))

(print
    (+
        (* 45 2)
        (/ 1020 39)))

;求和：39, 48, 72, 23, 91
(print (+ 39 48 72 23 91))

(print
    (exact->inexact
        (/ (+ 39 48 72 23 91) 5)))