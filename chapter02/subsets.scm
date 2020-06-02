(define (subsets s)
  (if (null? s)
      (list '())
      (let ((rest (subsets (cdr s))))
        (append rest (map (lambda (x)
                            (cons (car s) x))
                          rest)))))

(define s (list 1 2 3))

; 进入 (subsets (list 1 2 3)) START
; 👇
; (rest (subsets (list 2 3)))
; (append rest (map ? rest))

; 进入 (subsets (list 2 3))
; 👇
; (rest (subsets (list 3)))
; (append rest (map ? rest))

; 进入 (subsets (list 3))
; 👇
; (rest (subsets '()))
; (append rest (map ? rest))

; 进入 (subsets '())
; 👇
; return '()