(load "1.3.3.scm")

; 牛顿法
; 如果 x → g(x) 是一个可微方程，那么 g(x) = 0 的一个解就是函数 x → f(x) 的一个不动点
; 其中 f(x) = x - (g(x) / Dg(x))


; 导数
; 如果 g 是一个函数而 dx 是一个很小的数，那么 g 的导数在任一数值 x 的值下面：
; Dg(x) = (g(x+dx) - g(x)) / dx

(define dx 0.00001)

(define (deriv g)
  (lambda (x)
    (/ (- (g (+ x dx)) (g x))
       dx)))

; 将牛顿法描述为一个求不动点的过程
(define (newtons-transform g)
  (lambda (x)
    (- x (/ (g x) ((deriv g) x)))))


(define (newtons-method g guess)
  (fixed-point (newtons-transform g) guess))


; y^2 = x
; 通过牛顿法找出函数 y → y^2 - x 的零点
(define sqrt
  (lambda (x)
    (newtons-method (lambda (y) (- (square y) x))
                    1.0)))