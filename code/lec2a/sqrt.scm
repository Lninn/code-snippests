(load "../utils.scm")


(define average
   (lambda (a b)
      (/ (+ a b) 2.0)))


(define close-enough?
   (lambda (old new)
      (define t 0.00001)
      (< (abs (- old new)) t)))


(define fixed-point
   (lambda (f start)
      (define try
         (lambda (old new)
            (if (close-enough? old new)
               new
               (try new (f new)))))
      (try start (f start))))


(define (sqrt x)
   (fixed-point
      (lambda (y) (average y (/ x y)))
      1))


(define average-damp
   (lambda (f)
      (lambda (x)
         (average x (f x)))))


(define (sqrt-2 x)
   (fixed-point
      (average-damp (lambda (y) (/ x y)))
      1))


(log (sqrt 1522756))
(log (sqrt-2 1522756))