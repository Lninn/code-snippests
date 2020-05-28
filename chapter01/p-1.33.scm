(load "1.2.5.scm")
(load "1.2.6.scm")

; 编写 filtered-accumulate 过程
; 只组合起由给定范围得到的项里那些满足特定条件的项

(define (filtered-accumulate combiner null-value term a next b filter-test)
  (define (iter a result)
    (if (> a b)
      result
      (iter (next a)
            (let ((val (term a)))
              (if (filter-test val)
                (combiner val result)
                result)))))
  (iter a null-value))


(define (filtered-sum term a next b filter-test)
  (define (combiner a b) (+ a b))
  (filtered-accumulate combiner 0 term a next b filter-test))


(define (filtered-product term a next b filter-test)
  (define (combiner a b) (* a b))
  (filtered-accumulate combiner 1 term a next b filter-test))

; 计算素数之和
(define (sum-primes a b)
  (define (identity x) x)
  (define (inc x) (+ x 1))
  (define (filter-test x) (prime? x))
  (filtered-sum identity a inc b filter-test))

; 计算互素正整数之乘积
(define (product-of-coprimes n)
  (define (identity x) x)
  (define (inc x) (+ x 1))
  (define (filter-test x) (and (< x n) (= (gcd x n) 1)))
  (filtered-product identity 1 inc n filter-test))