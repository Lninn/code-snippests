(define (fast-expt-iter b n a)
  (cond ((= n 0) a)
        ; (expt 2 8) 可以转化为 (expt 4 4), 从而 n 的值不断减小
        ; a 的值在 even? 分支里面是保持不变的
        ((even? n) (fast-expt-iter (square b)
                                   (/ n 2)
                                   a))
        (else (fast-expt-iter b
                              (- n 1)
                              (* b a)))))

(define (fast-expt b n)
  (fast-expt-iter b n 1))
