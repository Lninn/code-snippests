; 素数

; 最直接的实现

(define (divides? a b)
  (= (remainder b a) 0))

(define (find-divisor n test-divisor)
  (cond ((> test-divisor (- n 1)) n)
        ((divides? test-divisor n) test-divisor)
        (else (find-divisor n (+ test-divisor 1)))))

; 根据如下事实，如果 n 不是素数，它必然有一个小于或者等于 n 的开方 的因子
; 可以将过程 find-divisor 简化
(define (find-divisor n test-divisor)
  (cond ((> (square test-divisor) n) n)
        ((divides? test-divisor n) test-divisor)
        (else (find-divisor n (+ test-divisor 1)))))

(define (smallest-divisor n)
  (find-divisor n 2))

(define (prime? n)
  (= n (smallest-divisor n)))


; 费马小定理：如果 n 是一个素数，a 是小于 n 的任意正整数，那么 a 的 n 次方和 a 模 n 同余。

; 即如果 n 是素数，则 对于一个任意小于 n 的正整数 a，满足下面的等式
; (remainder a^n n) == (remainder a n) == a

; 计算一个数的幂对另一个数取模的结果

; 对于指数值 e 大于 1 的情况，所采用的规约方式是基于下面的事实：对任意的 x、y 和 m，
; 我们总可以通过分别计算 x 取模 m 和 y 取模 m，而后将它们乘起来之后取模 m，
; 得到 x * y 取模 m 的余数

; Test
; Math.pow(12, 20) % 20 👉 16
; Math.pow(12, 10) % 10 * (Math.pow(12, 10) % 10) 👉 16

; Math.pow(4, 17) % 17 👉 4
; (4 * (Math.pow(4, 16) % 17)) % 17 👉 4

(define (expmod base exp m)
  (cond ((= exp 0) 1)
        ((even? exp)
          (remainder (square (expmod base (/ exp 2) m))
                     m))
        (else
          (remainder (* base (expmod base (- exp 1) m))
                     m))))


; 根据 费马小定理 可以得知
; 执行费马检查需要选取位于 1 和 n - 1 之间(包含这两者)的数 a，而后检查 a 的 n 次幂
; 取模 n 是否等于 a。

; 实现费马小定理过程
(define (fermat-test n)
  (define (try-it a)
    (= (expmod a n n) a))
  (try-it (+ 1 (random (- n 1)))))


; 对给定的数 n 做指定次数的费马检查
(define (fast-prime? n times)
  (cond ((= times 0) true)
        ; 如果某次检查失败，则 n 一次不是素数，否则继续检测
        ((fermat-test n) (fast-prime? n (- times 1)))
        (else false)))