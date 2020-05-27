; 根据阶乘的定义， n 的阶乘等于 n 乘以 n - 1 的阶乘
; 其中，1 的阶乘等于 1 本身

(define (factorial n)
  (if (= n 1)
      1
      (* n (factorial (- n 1)))))


; 阶乘的另一种计算方式
(define (fact-iter product counter max-count)
  ; 当 counter 大于 max-count 的时候，product 的值就是 n 的阶乘
  (if (> counter max-count)
      product
      (fact-iter (* product counter)
                 (+ counter 1)
                 max-count)))

(define (factorial n)
  (fact-iter 1 1 n))