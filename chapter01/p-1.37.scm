; k 项有限连分式

; 递归计算过程
(define (cont-frac n d k)
  (if (= k 0)
      0
      (/ (n k)
         (+ (d k) (cont-frac n d (- k 1))))))


; 迭代计算过程
(define (cont-frac-iter n d k result)
  (if (= k 0)
      result
      (cont-frac-iter n
                      d
                      (- k 1)
                      (/ (n k)
                         (+ (d k) result)))))

(define (cont-frac n d k)
  (cont-frac-iter n d k 0))


(define frac
  (lambda (k)
    (cont-frac (lambda (i) 1.0)
               (lambda (i) 1.0)
               k)))