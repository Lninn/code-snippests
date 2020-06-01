; 迭代
; 对于 reverse-iter 过程中，每次迭代 result 都必须是一个 cons
; 这样，下一次迭代的时候，上一次的 result 会被放到当前 cons 的 cdr 部分
; 符合 list 的构造规则，最后返回 result
(define (reverse items)
  (define (reverse-iter a result)
    (if (null? a)
        result
        (reverse-iter (cdr a)
                      (cons (car a) result))))
  (reverse-iter items '()))

(define z (list 1 4 9 16 25))