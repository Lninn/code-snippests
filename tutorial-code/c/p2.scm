(define f1
    (lambda (a b c)
        (if (and
                (positive? a)
                (positive? b)
                (positive? c))
            (* a b c))))

(define f2
    (lambda (a b c)
        (if (or
                (positive? a)
                (positive? b)
                (positive? c))
            (* a b c))))            