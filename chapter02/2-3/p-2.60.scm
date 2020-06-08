; element of a set are repeated
; set {1, 2, 3}
; (2 3 2 1 3 2 2)

; set {3 4 5}
; (3 4 4 5 5 3 2 3)

(define (element-of-set? x set)
  (cond ((null? set) false)
        ((equal? x (car set)) true)
        (else (element-of-set? x (cdr set)))))

(define (adjoin-set x set)
  (cons x set))


(define test '(2 3 2 1 3 2 2))
