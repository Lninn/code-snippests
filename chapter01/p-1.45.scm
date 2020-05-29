(load "1.2.4.scm")
(load "1.3.4.scm")
(load "p-1.44.scm")


; 计算 4 次方根
(define (four-root x)
  (fixed-point ((repeated average-damp 2) (lambda (y) (/ x (fast-expt y 3))))
               1.0))

; 计算 5 次方根
(define (five-root x)
  (fixed-point ((repeated average-damp 2) (lambda (y) (/ x (fast-expt y 4))))
               1.0))


; 计算 N 次方根
(define (N-root n)
  (lambda (x)
    (fixed-point ((repeated average-damp (lg n))
                  (lambda (y) (/ x (fast-expt y (- n 1)))))
                 1.0)))

; ((N-root 4) 16)

; 2 3  -0、3
; 4 5 6 7 -2、7
; 8 9 10 11 12 13 14 15 -3、15
; 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 -4、31
; 32 33 34                                     63 -5、64

; 3 7 15 21 63

; 计算 lgN
(define (lg n)
  (cond ((> (/ n 2) 1)
         (+ 1 (lg (/ n 2))))
        ((< (/ n 2) 1)
         0)
        (else
         1)))