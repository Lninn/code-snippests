; 定义平面上坐标点的构造函数和选择函数
(define (make-point x y)
  (cons x y))

(define (x-point p)
  (car p))

(define (y-point p)
  (cdr p))

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


(define (print-point p)
  (newline)
  (display "(")
  (display (x-point p))
  (display ", ")
  (display (y-point p))
  (display ")"))


(define s1
  (make-segment (make-point -3 5)
                (make-point 8 -1)))

(print-point (midpoint-segment s1))


(define len
  (distance (make-point 3 2)
            (make-point 9 7)))