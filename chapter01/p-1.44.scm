; 组合
(define (compose f g)
  (lambda (x)
    (f (g x))))


; 重复
(define (repeated f n)
  (if (= n 1)
      f
      (compose f
               (repeated f (- n 1)))))

(define dx 0.00001)

(define (smooth f)
  (define (average a b c)
    (/ (+ a b c) 3))
  (lambda (x)
    (average (f (- x dx))
             (f x)
             (f (+ x dx)))))

; (((repeated smooth 10) square) 5)