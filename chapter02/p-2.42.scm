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

(define (same-pair? p1 p2 i)
  (= (abs (- (car p1) (cadr p1)))
     (abs (- (car p2) (cadr p2)))))

(define (safe? k positions)
  (define (check p1 p2 i)
    (and (not (= (car p1) (car p2)))
         (not (same-pair? p1 p2 i))))
  (define (iter new-pos rest i)
    (cond ((null? rest) true)
          ((not (check new-pos (car rest) i))
           false)
          (else (iter new-pos (cdr rest) (+ i 1)))))
  (iter (car positions) (cdr positions) 1))

(define (queens board-size)
  (define nil '())

  (define empty-board nil)

  (define (adjoin-position row col rest)
    (append (list (cons row (cons col nil))) rest))

  (define (queen-cols k)
    (if (= k 0)
        (list empty-board)
        (filter
         (lambda (positions) (safe? k positions))
         (flatmap
          (lambda (rest-of-queens)
            (map (lambda (new-row)
                   (adjoin-position new-row k rest-of-queens))
                 (enumerate-interval 1 8)))
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

;(print-queens result)

(define seq (list (list 1 1)
                  (list 1 2)
                  (list 1 3)
                  (list 1 4)
                  (list 1 5)))