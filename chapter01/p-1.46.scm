; iterative-improve

(define average
  (lambda (x y) (/ (+ x y) 2.0)))

(define iterative-improve
  (lambda (close-enough? improve)
    (define iter
      (lambda (guess)
        (let ((next (improve guess)))
          (if (close-enough? next guess)
              guess
              (iter next)))))
    iter))

(define fixed-point
  (lambda (f first-guess)
    ((iterative-improve (lambda (v1 v2) (< (abs (- v1 v2)) 0.00001))
                        (lambda (g) (f g)))
     first-guess)))

(define sqrt
  (lambda (x)
    ((iterative-improve (lambda (v1 v2) (< (abs (- v1 v2)) 0.001))
                        (lambda (g) (average g (/ x g))))
     x)))

(define cube-root
  (lambda (x)
    (fixed-point (lambda (y) (average y (/ x (square y))))
                  1.0)))