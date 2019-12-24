(newline)

(define print-name
    (lambda (from to)
        (display "from ")
        (display from)
        (display " ")
        (display "to ")
        (display to)
        (display " ")
        (newline)))

(define (move n from to temp)
    (cond ((<= n 0) "Done!")
          (else
              (move (- n 1) from temp to)
              (print-name from to)
              (move (- n 1) temp to from))))

(move 3 "A" "C" "B")