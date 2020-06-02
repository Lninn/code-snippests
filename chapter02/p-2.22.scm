; p-2.22
(define (square-list items)
  (define (iter things answer)
    (if (null? things)
        answer
        (iter (cdr things)
              (cons (square (car things))
                    answer))))
  (iter items '()))

; (square-list (list 1 2 3 4))
; 首先，square-list 是一个递归调用的过程
; 第一次调用后 (iter (list 2 3 4) (cons 1 '()))
; 第二次调用后 (iter (list 3 4) (cons 4 (cons 1 '())))
; 第三次调用后 (iter (list 4) (cons 9 (cons 4 (cons 1 '()))))
; ...
; 最后导致 answer 变成了 (cons 16 (cons 9 (cons 4 (cons 1 '()))))
; 即 (16 9 4 1)

; 交换了 cons 的构造顺序
(define (square-list items)
  (define (iter things answer)
    (if (null? things)
        answer
        (iter (cdr things)
              (cons answer
                    (square (car things))))))
  (iter items '()))

; 第一次调用后 (iter (list 2 3 4) (cons '() 1))
; 第二次调用后 (iter (list 3 4) (cons (cons '() 1) 4))
; 第三次调用后 (iter (list 4) (cons (cons (cons '() 1) 4) 9))
; ...
; 最后 answer → (cons (cons (cons (cons '() 1) 4) 9) 16)
; 即 ((((() . 1) . 4) . 9) . 16)
;

; 修改后
(define (square-list items)
  (define (iter things answer)
    (if (null? things)
        (reverse answer)
        (iter (cdr things)
              (cons (square (car things))
                    answer))))
  (iter items '()))