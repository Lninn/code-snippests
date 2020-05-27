; 计算平方根

(newline)

(define (average a b)
    (/ (+ a b) 2.0))

(define (good-enough? guess x)
    (<
        (abs (- (square guess) x))
        0.0001))

(define (make-guess guess x)
    (average (/ x guess) guess))

(define (sqrt x)
    (define (try guess x)
        (if (good-enough? guess x)
            guess
            (try (make-guess guess x) x)))
    (try 1 x))

(newline)