(define (expand num den radix)
  (cons-stream
   (quotient (* num radix) den)
   (expand (remainder (* num radix) den) den radix)))

; (expand 1 7 10)
; 1*10 / 7 -> 1
; (expand 3 7 10)
; 3*10 / 7 -> 4
; (expand 2 7 10)
; 2*10 / 7 -> 2
; (expand 6 7 10)
; 6*10 / 7 -> 8
; (expand 4 7 10)
; 4*10 / 7 -> 5
; (expand 5 7 10)
; 5*10 / 7 -> 1
; (expand 1 7 10)
