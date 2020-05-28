(load "1.3.1.scm")

; 通过 lambda 构造 pi-sum 过程
(define (pi-sum a b)
  (sum (lambda (x) (/ 1.0 (* x (+ x 2))))
       a
       (lambda (x) (+ x 4))
       b))

; 在一个过程里面通过创建一个辅助过程来约束局部变量
(define (f x y)
  (define (f-helper a b)
    (+ (* x (square a))
       (* y b)
       (* a b)))
  (f-helper (+ 1 (* x y))
            (- 1 y)))

; 通过使用 lambda 表达式，上面的给过程可以变成下面的形式
(define (f x y)
  ((lambda (a b)
    (+ (* x (square a))
       (* y b)
       (* a b)))
   (+ 1 (* x y))
   (- 1 y)))

; 通过 let 语法改写
(define (f x y)
  (let ((a (+ 1 (* x y)))
        (b (- 1 y)))
    (+ (* x (square a))
       (* y b)
       (* a b))))

; 由 let 表达式描述的变量的作用域就是该 let 的体
; let 使人能在尽可能接近其使用的地方建立局部变量约束
; 变量的值是在 let 之外计算的(在为局部变量提供值的表达式依赖于某些与局部变量同名的变量时，
; 此表达式中变量的值，是在 let 之外计算的，并不是当前 let 中的值)