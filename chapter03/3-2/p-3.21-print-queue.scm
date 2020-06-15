(load "3.3.2-queue.scm")

(define (print-queue queue)
  (define (print items)
    (cond ((null? items)
           (newline))
          (else
           (display (car items))
           (display " ")
           (print (cdr items)))))
  (print (front-ptr queue)))

(define q1 (make-queue))

(insert-queue! q1 1)
(insert-queue! q1 2)

(delete-queue! q1)
(delete-queue! q1)

