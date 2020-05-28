; 加载 prime? 过程
(load "1.2.6.scm")

; 打印整数 n，并判断 n 是否是素数，如果是，再打印出三个星号，
; 随后是执行这一检查所用的时间量
(define (timed-prime-test n)
  (newline)
  (display n)
  (start-prime-test n (real-time-clock)))

(define (start-prime-test n start-time)
  (if (prime? n)
      (report-prime (- (real-time-clock) start-time))))

(define (report-prime elapsed-time)
  (display " *** ")
  (display elapsed-time))


; 编写 search-for-primes 过程，检查给定范围内连续的各个奇数的素性

; 1 一个只返回 奇数 的过程
(define (next-odd n)
  (if (even? n) (+ n 1) (+ n 2)))

; 生成连续素数的过程
(define (contiune-primes n count)
  (cond ((= count 0)
          (display "are primes."))
        ((prime? n)
          (display n)
          (newline)
          (contiune-primes (next-odd n) (- count 1)))
        (else (contiune-primes (next-odd n) count))))

(define (search-for-primes n)
  (let ((start-time (real-time-clock)))
       (contiune-primes n 3)
       (- (real-time-clock) start-time)))