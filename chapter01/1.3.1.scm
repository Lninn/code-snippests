; 计算从 a 到 b 的各整数之和
(define (sum-integers a b)
  (if (> a b)
      0
      (+ a (sum-integers (+ a 1) b))))

; 计算给定范围内的整数的立方之和
(define (sum-cubes a b)
  (if (> a b)
      0
      (+ (cube a) (sum-cubes (+ a 1) b))))


; 计算 Π/4
(define (pi-sum a b)
  (if (> a b)
      0
      (+ (/ 1.0 (* a (+ a 2))) (pi-sum (+ a 4) b))))


; 抽象的求和过程
(define (sum term a next b)
  (if (> a b)
      0
      (+ (term a) (sum term (next a) next b))))


(define (sum-cubes a b)
  (define (inc n) (+ n 1))
  (sum cube a inc b))

(define (sum-integers a b)
  (define (identity n) n)
  (define (inc n) (+ n 1))
  (sum identity a inc b))

(define (pi-sum a b)
  (define (pi-term x)
    (/ 1.0 (* x (+ x 2))))
  (define (pi-next x) (+ x 4))
  (sum pi-term a pi-next b))


; 求函数 f 在范围 a 和 b 之间的定积分的近似值
(define (integral f a b dx)
  (define (add-dx x) (+ x dx))
  (* (sum f (+ a (/ dx 2.0)) add-dx b)
     dx))