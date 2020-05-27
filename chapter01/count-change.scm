; 换零钱的方式程序
; 通过将给定现金换零钱的问题，递归的规约为更少的现金和更少的零钱种类上去

; a 代码现金，n 表示零钱的种类
; 如果 a 等于 0，算作 1 种换零钱的方式
; 如果 a 小于 0，算作 0 种换零钱的方式
; 如果 n 等于 0，算作 0 种换零钱的方式

(define (count-change amount)
  (cc amount 5))

(define (cc amount kinds-of-coins)
  (cond ((or (< amount 0) (= kinds-of-coins 0)) 0)
        ((= amount 0) 1)
        (else (+ (cc amount
                     (- kinds-of-coins 1))
                 (cc (- amount (first-denomination kinds-of-coins))
                     kinds-of-coins)))))

(define (first-denomination kinds-of-coins)
  (cond ((= kinds-of-coins 1) 1)
        ((= kinds-of-coins 2) 5)
        ((= kinds-of-coins 3) 10)
        ((= kinds-of-coins 4) 25)
        ((= kinds-of-coins 5) 50)))

; 实现迭代的方式