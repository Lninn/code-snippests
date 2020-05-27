(define (new-if predicate then-clause else-clause)
  (cond (predicate then-clause)
        (else else-clause)))

; 加载 求平方根文件
(load "1.1.7.scm")

(define (sqrt-iter guess x)
  (debug guess x)
  (new-if (good-enough? guess x)
      guess
      (sqrt-iter (improve guess x)
                 x)))

; 因为 lisp 解释器采用的是 应用序 的求值方式，在调用一个过程的时候，会先对
; 过程中的实际参数进行求值。在执行 sqrt-iter 过程中，首先是执行 new-if 过程。
; 根据 new-if 过程的定义，会先求的 predicate、then-clause、else-clause 的值，
; 其中 else-clause 是一个自己不断调用自己的过程，所以造成了不断循环的递归调用，
; 从而出现异常。


; Test.
(define (predicate)
  (display "predicate")
  true)

(define (then-test)
  (display "then-test")
  100)

(define (else-test)
  (display "else-test")
  200)  
