(define (fixed-point f first-guess)
  (define tolerance 0.00001)

  (define (close-enough? v1 v2)
    (< (abs (- v1 v2)) tolerance))

  (define (try guess)
    (newline)
    (display guess)
    (let ((next (f guess)))
      (if (close-enough? guess next)
          next
          (try next))))
  (try first-guess))

; 不用平均阻尼
(define f1
  (lambda ()
    (fixed-point (lambda (x) (/ (log 1000) (log x)))
                 2.0)))

; 使用平均阻尼
(define f2
  (lambda ()
    (fixed-point (lambda (x) (average x (/ (log 1000) (log x))))
                 2.0)))