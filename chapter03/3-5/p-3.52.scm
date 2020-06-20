(load "stream.scm")

(define sum 0)

(define (accum x)
  (set! sum (+ x sum))
  sum)

; (define seq (stream-map accum ))
; (define y (stream-filter even? seq))
; (define z (stream-filter (lambda (x) (= (remainder x 5) 0))
;                          seq))

(define s (stream-enumerate-interval 1 20))

(display-stream s)