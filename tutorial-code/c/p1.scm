(define abs
    (lambda (n)
        (* n (if (positive? n) 1 -1))))

(define inv
    (lambda (n)
        (if (not (zero? n))
            (/ n)
            #f)))

(define to-char
    (lambda (n)
        (if (and (<= n 126) (>= n 33))
            (integer->char n)
            #f)))