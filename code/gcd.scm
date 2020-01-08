(define (log a b)
   (display a)
   (display b)
   (newline))

; 循环
(define (gcd-1 n1 n2)
   (let ((len (min n1 n2)))
      (define (iter num result)
         (cond
            ((and
               (= (remainder n1 num) 0)
               (= (remainder n2 num) 0))
               (iter (+ num 1) num))
            ((>= num len) result)   
            (else
               (iter (+ num 1) result))))
      (iter 1 1)))

(newline)
(log "test " "gcd-1 proc")
(log "15 3: " (gcd-1 15 3))
(log "18 9: " (gcd-1 18 9))
(log "10 4: " (gcd-1 10 4))
(log "20 20: " (gcd-1 20 20))


; gcd(a, b) = gcd(b, a mod b)
(define (gcd-2 n1 n2)
   (define (iter a b)
      (if (= b 0)
         a
         (iter b (remainder a b))))
   (iter n1 n2))

(newline)
(log "test " "gcd-2 proc")
(log "15 3: " (gcd-2 15 3))
(log "18 9: " (gcd-2 18 9))
(log "10 4: " (gcd-2 10 4))
(log "20 20: " (gcd-2 20 20))

;1 若a > b，则a = a - b
;2 若b > a，则b = b - a
;3 若a == b，则a(或b)即为最大公约数
;4 若a != b，则回到 (1)
(define (gcd-3 n1 n2)
   (define (iter a b)
      (cond
         ((eqv? a b) a)
         ((> a b) (iter (- a b) b))
         ((> b a) (iter a (- b a)))))
   (iter n1 n2))

(newline)
(log "test " "gcd-3 proc")
(log "15 3: " (gcd-3 15 3))
(log "18 9: " (gcd-3 18 9))
(log "10 4: " (gcd-3 10 4))
(log "20 20: " (gcd-3 20 20))

;export
(define (gcd a b)
   (gcd-2 a b))