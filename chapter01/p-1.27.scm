; Carmichael Number
; 561 1105 1729 2465 6601

(load "1.2.6.scm")

(define (carmichael-test n)
  (test-iter 1 n))

(define (test-iter a n)
  (cond ((= a n) true)
        ((congruent? a n)
          (test-iter (+ a 1) n))
        (else false)))

(define (congruent? a n)
  (= (expmod a n n) a))