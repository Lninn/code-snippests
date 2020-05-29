; 方程 f(x) = x^3 + ax^2 + bx + c

(load "newtons-method.scm")

(define cubic
  (lambda (a b c)
    (lambda (x)
      (+ (cube x)
         (* a (square x))
         (* b x)
         c))))

(define test
  (lambda ()
    (newtons-method (cubic 2 6 8) 1.0)))