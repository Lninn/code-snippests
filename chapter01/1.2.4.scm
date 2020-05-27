; 百度百科定义
; 幂指乘方运算的结果。nm指将n自乘m次（针对m为正整数的场合）。
; 把幂看作乘方的结果，叫做“n的m次幂”或“n的m次方”。

; 线性的递归计算过程
; 需要 θ(n) 步和 θ(n) 空间
(define (expt b n)
  (if (= n 0)
      1
      (* b (expt b (- n 1)))))

; 线性的迭代计算过程
; 需要 θ(n) 步和 θ(1) 空间
(define (expt-iter b counter product)
  (if (= counter 0)
      product
      (expt-iter b
                 (- counter 1)
                 (* b product))))

(define (expt b n)
  (expt-iter b n 1))      

; 通过连续求平方的方式求值
(define (fast-expt b n)
  (cond ((= n 0) 1)
        ((even? n) (square (fast-expt b (/ n 2))))
        (else (* b (fast-expt b (- n 1))))))

; 连续求平方对应的迭代方法
(define (fast-expt-iter b n a)
  (cond ((= n 0) a)
        ; (expt 2 8) 可以转化为 (expt 4 4), 从而 n 的值不断减小
        ; a 的值在 even? 分支里面是保持不变的
        ((even? n) (fast-expt-iter (square b)
                                   (/ n 2)
                                   a))
        (else (fast-expt-iter b
                              (- n 1)
                              (* b a)))))

(define (fast-expt b n)
  (fast-expt-iter b n 1))
