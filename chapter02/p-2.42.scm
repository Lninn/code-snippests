; p-2.42
; 八皇后问题

(load "../utils/list-ref.scm")
(load "flatmap.scm")
(load "enumerate-interval.scm")

(define (every predicate sequence)
  (cond ((null? sequence) true)
        ((not (predicate (car sequence)))
         false)
        (else (every predicate (cdr sequence)))))

; 不考虑顺序 remove last
(define (remove-last items)
  (if (not (null? items))
      (cdr (reverse items))))

(define (same-pair? p1 p2)
  (= (abs (- (car p1) (cadr p1)))
     (abs (- (car p2) (cadr p2)))))

(define (safe? k positions)
    ; 需要判断三个方向是否安全
    (if (null? positions)
        true
        (let ((crt (car positions))
              (rest (cdr positions)))
          (every (lambda (item)
                   (and (not (= (car crt) (car item)))
                        (not (same-pair? crt item))))
           rest))))

(define (queens board-size)
  (define nil '())

  (define empty-board nil)

  (define (adjoin-position new-row k rest-of-queens)
    (append (list (cons new-row (cons k nil))) rest-of-queens))

  (define (queen-cols k)
    (if (= k 0)
        (list empty-board)
        (filter
         (lambda (positions) (safe? k positions))
         (flatmap
          (lambda (rest-of-queens)
            (map (lambda (new-row)
                   (adjoin-position new-row k rest-of-queens))
                 (enumerate-interval 1 board-size)))
          (queen-cols (- k 1))))))
  (queen-cols board-size))

(define result (queens 8))

(define (print-queens queens)
  (cond ((null? queens) (newline) (display "END"))
        (else
         (newline)
         (display (car queens))
         (print-queens (cdr queens)))))

(newline)
(display (length result))

(print-queens result)

; (4, 7) (2, 5)
; (4, 7) (7, 4)

(define seq (list (list 1 1)
                  (list 1 2)
                  (list 1 3)
                  (list 1 4)
                  (list 1 5)))