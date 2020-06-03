(load "accumulate.scm")
(load "filter.scm")
(load "enumerate-interval.scm")
(load "enumerate-tree.scm")
(load "fib.scm")

(define (even-fibs n)
  (accumulate cons
              '()
              (filter even?
                      (map fib
                           (enumerate-interval 0 n)))))

(define (sum-odd-squares tree)
  (accumulate +
              0
              (map square
                   (filter odd?
                           (enumerate-tree tree)))))

(define (list-fib-squares n)
  (accumulate cons
              '()
              (map square
                   (map fib
                        (enumerate-interval 0 n)))))

(define (product-of-squares-of-odd-elements sequence)
  (accumulate *
              1
              (map square
                   (filter odd? sequence))))


(define x (list 1 2 3 4 5))

(define tree (list 1 (list 2 3 4 (list 5 6) 7 8) 9))