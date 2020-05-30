(load "p-2.2.scm")

; 矩形的三种表示 (长方形)
; 1 通过指定 长 和 宽 来表示一个矩形
; 2 通过指定 四个点 来表示一个矩形
; 3 通过指定 一个水平距离、一个垂直距离以及一个原点来表示一个矩形

; 计算矩形的面积：
; 长方形 → 长 * 宽

; 计算矩形的周长：
; 长方形 → (长 + 宽) * 2

; 矩形的构造函数和选择函数
(define (make-rect original horizontal vertical)
  (cons original (cons horizontal vertical)))

(define (original r)
  (car r))

(define (horizontal r)
  (car (cdr r)))

(define (vertical r)
  (cdr (cdr r)))

(define (rect-width r)
  (distance (original r)
            (vertical r)))

(define (rect-height r)
  (distance (original r)
            (horizontal r)))

; 计算矩形的周长和面积
(define (rect-perimeter r)
  (* (rect-width r)
     (rect-height r)))

(define (rect-area r)
  ( / (+ (rect-width r)
         (rect-height r))
      2.0))

(define r1
  (make-rect (make-point 0 0)
             (make-point 8 0)
             (make-point 0 4)))

;