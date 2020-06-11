(load "estimate-pi.scm")

(define (random-in-range low high)
  (let ((range (- high low)))
    (+ low (random (exact->inexact range)))))

; estimate-integral
(define (estimate-integral predicate rect trials)
  (define (integral-test)
    (let ((x1 (car rect))
          (y1 (cadr rect))
          (x2 (caddr rect))
          (y2 (cadddr rect)))
      (let ((rand-x (random-in-range x1 x2))
            (rand-y (random-in-range y1 y2)))
        (predicate rand-x rand-y))))
  
  (* 4 (monte-carlo trials integral-test)))

(define (get-pi trials)
  (estimate-integral
   (lambda (x y) (< (+ (square x) (square y)) 1.0))
   (list -1 -1 1 1)
   trials))