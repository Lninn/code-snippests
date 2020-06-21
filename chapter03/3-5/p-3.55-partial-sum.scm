(define (add-stream s1 s2)
  (stream-map + s1 s2))

(define (stream-starting-from n)
  (cons-stream n (stream-starting-from (+ n 1))))

(define integers (stream-starting-from 1))

(define (partial-sum seq)
  (cons-stream 1 (add-stream (partial-sum seq) (stream-cdr seq))))

(define s (partial-sum integers))
