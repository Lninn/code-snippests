(load "operation-system.scm")

(define (install-equ-package)
  (define (equ? a b)
    (if (and (number? a) (number? b))
        (= a b)
        (let ((a-type (type-tag a))
              (b-type (type-tag b)))
          (if (eq? a-type b-type)
              (let ((cmp (get 'equal? a-type)))
                (if cmp
                    (cmp (contents a) (contents b))
                    (error "doesn't not exist type -- EQU?" (list a-type))))
              (error "Not a same type can't compare -- EQU?" (list a b))))))
  (put 'equal? 'equ? equ?)
  'ok)

(install-equ-package)

(define equ? (get 'equal? 'equ?))