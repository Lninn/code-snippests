(load "accumulate.scm")
(load "enumerate-tree.scm")

(define (count-leaves tree)
  (accumulate +
              0
              (map (lambda (x) 1)
                   (enumerate-tree tree))))