; 抽象的求和过程
(define (sum term a next b)
  (if (> a b)
      0
      (+ (term a) (sum term (next a) next b))))

; 辛普森规则求函数 f 的积分值
(define (simpson f a b n)
  (define (inc x) (+ x 1))
  (define h (/ (- b a) n))
  (define (get-k k)
    (cond ((or (= k 0) (= k (- n 1))) 1)
          ((even? k) 4)
          (else 2)))
  ; 所有的计算全部在 term 中，根据 k 的值
  ; k 的值从 1 开始，直到 n
  (define (term k) (* (get-k k) (f (+ a (* k h)))))
  (* (sum term 1 inc n)
     (/ h 3.0)))