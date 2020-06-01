; 定义平面上坐标点的构造函数和选择函数
(define (make-point x y)
  (cons x y))

(define (x-point p)
  (car p))

(define (y-point p)
  (cdr p))

(define (print-point p)
  (newline)
  (display "(")
  (display (x-point p))
  (display ", ")
  (display (y-point p))
  (display ")"))

; Usage
; (define p1 (make-point 3 4))

; (print-point p1)