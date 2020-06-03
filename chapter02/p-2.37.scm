(load "accumulate-n.scm")

(define (dot-product v w)
  (accumulate +
              0
              (map * v w)))

; Matrix vector multiplication
(define (matrix-*-vector m v)
  (map (lambda (x)
         (dot-product x v))
       m))

; Matrix transpose
(define (transpose mat)
  (accumulate-n cons
                '()
                mat))

; Matrix multiplication matrix
(define (matrix-*-matrix m n)
  (let ((cols (transpose n)))
    (map (lambda (x)
           (map (lambda (y)
                  (dot-product x y))
                cols))
         m)))

; Usage
(define matrix (list (list 1 2 3 4)
                     (list 4 5 6 6)
                     (list 6 7 8 9)))

(define vector (list 1 2 3 4))

(define matrix-1 (list (list 1 2 3)
                       (list 4 5 6)))

(define matrix-2 (list (list 7 8)
                       (list 9 10)
                       (list 11 12)))