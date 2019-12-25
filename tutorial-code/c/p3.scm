(define grade
    (lambda (score)
        (cond
            ((>= score 80) "A")
            ((and (>= score 60) (<= score 79)) "B")
            ((and (>= score 40) (<= score 59)) "C")
            ((< score 40) "D"))))