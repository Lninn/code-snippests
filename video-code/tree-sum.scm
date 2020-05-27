; (tree-sum '(1 2)) result is 3
; (tree-sum '(1 (2 3))) result is 6
; (tree-sum '((1 2) (3 4))) result is 10
; (tree-sum '((1 2) 3) ((1 2) (3 4))) result is 16

(load "utils.scm")

(define (tree-sum exp)
   (cond
      ((null? exp) 0)
      ((number? exp) exp)
      ((pair? exp)
         (let ((v1 (tree-sum (car exp)))
               (v2 (tree-sum (cdr exp))))
               (+ v1 v2)))))


(log (tree-sum '(1 2)))
(log (tree-sum '(1 (2 3))))
(log (tree-sum '((1 2) (3 4))))
(log (tree-sum '(((1 2) 3) ((1 2) (3 4)))))
