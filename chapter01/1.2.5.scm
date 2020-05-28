; 最大公约数

; 欧几里得算法：如果 r 是 a 除以 b 的余数，那么 a 和 b 的公约数正好也是
; b 与 r 的公约数

(define (gcd a b)
  (if (= b 0)
      a
      (gcd b (remainder a b))))