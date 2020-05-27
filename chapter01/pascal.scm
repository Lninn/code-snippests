(define (pascal row col)
    (if (or (= row col) (= col 0) )
        1
        (+ (pascal (- row 1) (- col 1))
           (pascal (- row 1) col))))