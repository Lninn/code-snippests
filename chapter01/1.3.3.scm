; 搜索给定函数 f 在给定范围内的根
(define average
  (lambda (x y) (/ (+ x y) 2)))

(define close-enough?
  (lambda (x y) (< (abs (- x y)) 0.001)))

(define (search f neg-point pos-point)
  (let ((midpoint (average neg-point pos-point)))
    (if (close-enough? neg-point pos-point)
        midpoint
        (let ((test-value (f midpoint)))
          (cond ((positive? test-value)
                  (search f neg-point midpoint))
                ((negative? test-value)
                  (search f midpoint pos-point))
                (else midpoint))))))

(define half-interval-method
  (lambda (f a b)
    (let ((a-value (f a))
          (b-value (f b)))
      (cond ((and (negative? a-value) (positive? b-value))
              (search f a b))
            ((and (negative? b-value) (positive? a-value))
              (search f b a))
            (else
              (error "Values are not of opposite sign" a b))))))

; 找出函数的不动点
; 数 x 称为函数 f 的不动点，如果 x 满足方程 f(x) = x

(define (fixed-point f first-guess)
  (define tolerance 0.00001)

  (define (close-enough? v1 v2)
    (< (abs (- v1 v2)) tolerance))

  (define (try guess)
    (let ((next (f guess)))
      (if (close-enough? guess next)
          next
          (try next))))
  (try first-guess))

; 计算平方根
(define sqrt
  (lambda (x)
    (fixed-point (lambda (y) (average y (/ x y)))
                  1.0)))

