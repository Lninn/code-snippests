; 函数的规则
; 如果 n 小于 3，那么 f(n) = n
; 如果 n 大于等于 3，fn(n) = f(n - 1) + 2f(n - 2) + 3f(n - 3)

; 实现递归的计算过程
(define (func n)
  (if (< n 3)
      n
      (+ (func (- n 1))
         (* 2 (func (- n 2)))
         (* 3 (func (- n 3))))))


; 实现迭代的计算过程

; 思考

; 根据函数的数学定义，可以得出下面的结论
; f(0) = 0, f(1) = 1, f(2) = 2,
; f(3) = f(2) + 2*f(1) + 3f(0)
; f(4) = f(3) + 2*f(2) + 3f(1)
; 观察上面的等式可以发现，必须要用变量来存储一些中间结果:
; a b c 的初始值分别为 0 1 2，这些值的变换规则为
; a -> b
; b -> c
; c -> (+ c (* 2 b) (* 3 a))
;
; 每次计算之后的值以 c 为准

; 比如
; => 第一次
; a = 0
; b = 1
; c = 2
;
; => 第二次
; a = b = 1
; b = c = 2
; c = calc = 4
;
; => 第三次
; a = 2
; b = 4
; c = 11
;
; count 初始化为 2 (因为 n 小于 3 时， f(n) = n, 迭代的计算也要按照函数的定义把 f(3) 包含进去
; 如果 n 从 3开始，那么按照下面的迭代算法，就跳过了 f(3), 直接从 f(4) 开始了，会导致计算错误)
; 当前 count 等于 max-count 时返回 c 的值即为最终值
; 

; a = 0
; b = 1
; c = 2
;
(define (func-iter a b c counter max-count)
  (cond ((= max-count 0) 0)
        ((= max-count 1) 1)
        ((= max-count 2) 2)
        ((= max-count counter) c)
        (else (func-iter b
                         c
                         (+ c (* 2 b) (* 3 a))
                         (+ counter 1)
                         max-count))))

(define (func-2 n)
  (func-iter 0 1 2 2 n))