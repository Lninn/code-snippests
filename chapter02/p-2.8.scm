(load "interval.scm")

(define r1 (make-interval 6.12 7.48))

(define r2 (make-interval 4.47 4.93))

; 6.8-0.68=6.12
; 6.8+0.68=7.48
;(6.12, 7.48)

; 4.7+0.23=4.93
; 4.7-0.23=4.47
; (4.47, 4.93)

(print-interval (div-interval r1 r2))