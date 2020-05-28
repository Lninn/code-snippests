; Miller-Rabin 检查

; 1 取模 n 的非平凡方根，即
; 存在一个数 a，不等于1，不等于 n - 1，且 a 的平方取模 n 等于 1

(define (expmod base exp m)
  (cond ((= exp 0) 1)
        ((nontrivial-square-root? base m)
          0)
        ((even? exp)
          (remainder (square (expmod base (/ exp 2) m))
                     m))
        (else
          (remainder (* base (expmod base (- exp 1) m))
                     m))))

; 非平凡方根检查
(define (nontrivial-square-root? a n)
  (and (not (= a 1))
       (not (= a (- n 1)))
       (= 1 (remainder (square a) n))))

; 生成大于等于 0 小于 n 的随机数
(define (non-zero-random n)
  (let ((r (random n)))
    (if (not (= r 0))
        r
        (non-zero-random n))))

(define (miller-rabin-test n)
  (let ((times (ceiling (/ n 2))))
    (test-iter n times)))

(define (test-iter n times)
  (cond ((= times 0) true)
        ((= (expmod (non-zero-random n) (- n 1) n) 1)
          (test-iter n (- times 1)))
        (else false)))