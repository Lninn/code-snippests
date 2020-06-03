(load "flatmap.scm")

; For S {1, 2, 3}
; when X = 1, S-X = {2, 3}
;     For {2, 3}
;     when X = 2, S-X = {3}
;         ; For {3}
;         ; (cons 3 nil) 👉👉👉 (1 2 3)
;     when X = 3, S-X = {2}
;         ; For {2}
;         ; (cons 2 nil) 👉👉👉 (1 3 2)

; when X = 2, S-X = {1, 3}
;     For {1, 3}
;     when X = 1, S-X = {3}
;         ; For {3}
;         ; (cons 3 nil) 👉👉👉 (2 1 3)
;     when X = 3, S-X = {1}
;         ; For {1}
;         ; (cons 1 nil) 👉👉👉 (2 3 1)

; when X = 3, S-X = {1, 2}
;     For {1, 2}
;     when X = 1, S-X = {2}
;         ; For {2}
;         ; (cons 2 nil) 👉👉👉 (3 1 2)
;     when X = 2, S-X = {1}
;         ; For {1}
;         ; (cons 1 nil) 👉👉👉 (3 2 1)

(define (remove item sequence)
  (filter (lambda (x) (not (= x item)))
          sequence))

(define (permutations s)
  (if (null? s)
      (list '())
      (flatmap (lambda (x)
                 (map (lambda (p) (cons x p))
                      (permutations (remove x s))))
               s)))