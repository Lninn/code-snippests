(load "stream.scm")

(define sum 0)

(define (accum x)
  (set! sum (+ x sum))
  sum)

; make a sequence
; from 1 to 20
; sum = 0
(define s (stream-enumerate-interval 1 20))

; 对 s 执行 stream-map 过程
; 其中 accum 会将每一次调用的参数累计到一起并返回
; sum = 1
(define seq (stream-map accum s))

; 过滤 seq 序列，过滤函数为 even, 即只保留偶数
; 1 不是偶数，重新计算出 2，因为 accum 过程 会返回 3
; 不满足，继续 seq 求值计算出 3，返回 6，满足过滤条件
; 返回 6 和 延迟表达式
; sum = 6
(define y (stream-filter even? seq))

; 首先，6 不满足过滤条件，计算出 seq 计算出 4 返回 10 满足
; 返回 10 和 延迟表达式
; sum = 10
(define z (stream-filter (lambda (x) (= (remainder x 5) 0))
                         seq))
