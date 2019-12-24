(define debug
    (lambda (a b)
        (newline)
        (display a)
        (display " ")
        (display b)
    )
)
(define sos
    (lambda (a b)
        (debug a b)
        (if (= a 0)
            b
            (sos
                (- a 1)
                (+ b 1)
            )
        )
    )
)

(define sos2
    (lambda (a b)
        (debug a b)
        (if (= a 0)
            b
            (+
                (sos2
                    (- a 1)
                    b
                )
                1
            )
        )
    )
)