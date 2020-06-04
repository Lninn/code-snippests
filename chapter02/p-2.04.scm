; cons 过程接口两个参数 x y
; 和语言提供的实现一致，然后返回了一个过程。
; 返回的这个过程接受一个参数，这个参数是一个过程
; 重点就是 cons 过程里的 x、y 会被应用到返回的过程参数
(define (cons x y)
  (lambda (m) (m x y)))

; car 过程接受一个参数 z，这个 z 时一个可以执行的过程
; 执行的时候会传递一个 lambda 到 作为 参数z 的参数
(define (car z)
  (z (lambda (p q) p)))

; cdr 和 car 类似
(define (cdr z)
  (z (lambda (p q) q)))

; 从上面的定义可知，cons 中的 lambda 过程需要的参数 m
; 就是分别从 car 和 cdr 传入的 lambda 

; 而 car 和 cdr 中的 lambda 表达的很明显；接受两个参数
; 然后根据条件返回第一个或者第二个