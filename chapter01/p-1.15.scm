(define (cube x) (* x x x))

(define (p x) (- (* 3 x) (* 4 (cube x))))

(define (sine angle)
  (if (not (> (abs angle) 0.1))
      angle
      (p (sine (/ angle 3.0)))))

; (sine 10) p call 5 times  
; (sine 30) p call 6 times    
; (sine 90) p call 7 times

; 每当 a 增大一倍（乘以因子 3），p 的运行次数就加 1