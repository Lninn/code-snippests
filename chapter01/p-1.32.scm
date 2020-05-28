; sum 过程是求某一确定范围内指定数值的和，同理，product 是求某一确定范围内指定数值的积
; 它们共同的特点：对某一确定序列的元素进行累计的计算
; 在这个累计的计算中，分别指定了每个元素应该如何参与，计算应该何时结束，以及该计算的
; 初始值应该如何设定，重点是参与计算的各个元素应该以何种方式组合以完成这个累计的过程

; 编写一个累计过程 accumulate
(define (accumulate combiner null-value term a next b)
  (define (iter a result)
    (if (> a b)
        result
        (iter (next a)
              (combiner (term a) result))))
  (iter a null-value))

; 递归计算
(define (accumulate combiner null-value term a next b)
  (if (> a b)
       null-value
       (combiner (term a) (accumulate combiner
                   null-value
                   term
                   (next a)
                   next
                   b))))

(define (sum term a next b)
  (define (combiner a b) (+ a b))
  (accumulate combiner 0 term a next b))

(define (product term a next b)
  (define (combiner a b) (* a b))
  (accumulate combiner 1 term a next b))


; Test
(define (sum-integers a b)
  (define (identity x) x)
  (define (inc x) (+ x 1))
  (sum identity a inc b))

(define (factorial n)
  (define (identity x ) x)
  (define (inc x ) (+ x 1))
  (product identity 1 inc n))