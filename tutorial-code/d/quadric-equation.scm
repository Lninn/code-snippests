(define (quadric-equation a b c)
  (if (zero? a)      
      'error                                      ; 1
      (let ((d (- (* b b) (* 4 a c))))            ; 2
        (if (negative? d)
            '()                                      ; 3
            (let ((e (/ b a -2)))                    ; 4
              (if (zero? d)
              (list e)
              (let ((f (/ (sqrt d) a 2)))        ; 5
                (list (+ e f) (- e f)))))))))