(load "tree-map.scm")

(define (square-tree tree)
  (tree-map square tree))

(define (scale-tree tree)
  (tree-map (lambda (x) (* x 10)) tree))

(define tree (list 1 (list 2 (list 3 4) 5) (list 6 7)))