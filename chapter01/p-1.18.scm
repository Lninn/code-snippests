; 编写一个只用对数步数就能求出两个整数的乘积的过程

(define (double x) (+ x x))

(define (halve x) (/ x 2))

(define (fast-mul-iter a b s)
  (cond ((= b 0) s)
        ; 当 b 为偶数的时候，保持整体的计算结果不会改变，但是问题的复杂度减小了一半
        ((even? b) (fast-mul-iter (double a)
                             (halve b)
                             s))
        (else (fast-mul-iter a
                             (- b 1)
                             (+ s a)))))

(define (fast-mul a b)
  (fast-mul-iter a b 0))