(load "p-2.38.scm")

(define (reverse sequence)
  (fold-left (lambda (current next)
                (cons next current))
              '()
              sequence))

(define (reverse sequence)
  (fold-right (lambda (current next)
                (append next (list current)))
             '()
             sequence))

(define seq (list 1 2 3 4 5))