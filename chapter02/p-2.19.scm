(load "../chapter01/count-change.scm")
(load "../utils/print-value.scm")
(load "list.scm")

(define (cc amount coin-values)
  (cond ((= amount 0) 1)
        ((or (< amount 0) (no-more? coin-values)) 0)
        (else (+ (cc amount
                     (except-first-denomination coin-values))
                 (cc (- amount
                        (first-denomination coin-values))
                     coin-values)))))

(define us-coins (list 50 25 10 5 1))

(define uk-coins (list 100 50 20 10 5 2 1 0.5))

(define ch-coins (list 100 50 20 10 5 1 5 1))

(define (no-more? items)
  (let ((len (length items)))
    (or (= len 0) (< len 0))))

(define (except-first-denomination items)
  (print-value "items " items)
  (let ((len (length items)))
    (cond ((or (= len 0) (= len 1)) '())
          (else (cdr items)))))

(define (first-denomination items)
  (let ((len (length items)))
    (cond ((= len 0) 0)
          ((= len 1) (car items))
          (else (car items)))))