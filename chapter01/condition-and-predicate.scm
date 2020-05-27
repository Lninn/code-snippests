(define (abs x)
  (cond ((> x 0) x)
        ((= x 0) 0)
        ((< x 0) (- x))))


; 没有匹配到指定 predicate 并且没有指定 else 表达式的时候
; 整个表达式没有返回值
; Unspecified return value
(define (test-condition x)
  (cond ((= x 1) 1)
        ((= x 2) 2)))


(define (abs2 x)
  (cond ((< x 0) (- x))
        (else x)))


(define (condition2 x)
  (cond ((= x 0) 0)
        ;每个 cond 子句的 <e> 部分可以是一个表达式序列，会被解释器顺序的求值
        ;其中，最后一个表达式的值作为整个表达式的值返回
        ((= x 1) (+ 1 1) (+ 2 2))
        ))


(define (abs-if x)
  (if (< x 0)
      (- x)
      x))