; 蒙特卡罗方法

(define (random-in-range low high)
  (let ((range (- high low)))
    (+ low (random range))))

(define (rand)
  (random-in-range 1 1000))

; cesaro-test
(define (cesaro-test)
  (= (gcd (rand) (rand)) 1))

; monte-carlo
; trials 执行实验的次数
; experiment 一个无参数的实验过程
(define (monte-carlo trials experiment)
  (define (iter trials-remaining trials-passed)
    (cond ((= trials-remaining 0)
           (/ trials-passed trials))
          ((experiment)
           (iter (- trials-remaining 1) (+ trials-passed 1)))
          (else
           (iter (- trials-remaining 1) trials-passed))))
  (iter trials 0))

; estimate-pi
(define (estimate-pi trials)
  (sqrt (/ 6 (monte-carlo trials cesaro-test))))