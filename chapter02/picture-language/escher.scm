(define (flipped-pairs painter)
  (let ((painter2 (beside painter (flip-vert painter))))
    (below painter2 painter2)))

(define wave 0)
(define wave4 (flipped-pairs wave))

; p-2.45
(define (split a b)
  (define iter (lambda (painter n)
    (if (= n 0)
        painter
        (let ((smaller (iter painter (- n 1))))
          (a painter (b smaller smaller))))))
  iter)

P109