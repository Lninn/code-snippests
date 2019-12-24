(define fib
    (lambda (n)
        (if (< n 2)
            n
            (+
                (fib (- n 1))
                (fib (- n 2))))))


;迭代

(define fib2
    (lambda (n)
        (fib-iter n 0 1)
    )
)

(define fib-iter
    (lambda (n a b)
        (cond
            ((= n 1) a)
            ((= n 2) b)
            (else
                (fib-iter
                    (- n 1)
                    b
                    (+ a b)
                )
            )
        )
    )
)