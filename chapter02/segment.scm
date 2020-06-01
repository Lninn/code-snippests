(load "point.scm")

; 定义平面一条线段的构造函数和选择函数
(define (make-segment start end)
  (cons start end))

(define (start-segment s)
  (car s))

(define (end-segment s)
  (cdr s))

; 返回一条线段的中点
(define (midpoint-segment s)
  (let ((s (start-segment s))
        (e (end-segment s)))
       (make-point (/ (+ (x-point s) (x-point e)) 2.0)
                   (/ (+ (y-point s) (y-point e)) 2.0))))

; 计算两点间的距离
(define (distance p1 p2)
  (sqrt (+ (square (- (x-point p1) (x-point p2)))
           (square (- (y-point p1) (y-point p2))))))