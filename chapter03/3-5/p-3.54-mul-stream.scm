(define (mul-stream s1 s2)
  (stream-map * s1 s2))

(define (stream-starting-from n)
  (cons-stream n (stream-starting-from (+ n 1))))

(define integers (stream-starting-from 1))

(define factorials (cons-stream 1 (mul-stream factorials
                                              (stream-cdr integers))))
