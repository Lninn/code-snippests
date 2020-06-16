; deque

(define (front-ptr deque)
  (car deque))

(define (rear-ptr deque)
  (cdr deque))

(define (set-front-ptr! deque item)
  (set-car! deque item))

(define (set-rear-ptr! deque item)
  (set-cdr! deque item))

(define (make-deque) (cons '() '()))

(define (make-pair item)
  (cons item (cons '() '())))

(define (empty-deque? deque)
  (null? (front-ptr deque)))

(define (front-insert-deque! deque item)
  (let ((new-pair (make-pair item)))
    (cond ((empty-deque? deque)
           (set-front-ptr! deque new-pair)
           (set-rear-ptr! deque new-pair)
           deque)
          (else
           (set-cdr! (cdr new-pair) (front-ptr deque))
           (set-car! (cdr (front-ptr deque)) new-pair)
           (set-front-ptr! deque new-pair)))))

(define q1 (make-deque))

(front-insert-deque! q1 1)
(front-insert-deque! q1 2)


;->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
;FROM http://weimalearnstoprogram.blogspot.com/2009/11/sicp-exercise-323.html
; Exercise 3.23.  A deque (``double-ended queue'') is a sequence in which items can be inserted and deleted at either the front or the rear. Operations on deques are the constructor make-deque, the predicate empty-deque?, selectors front-deque and rear-deque, and mutators front-insert-deque!, rear-insert-deque!, front-delete-deque!, and rear-delete-deque!. Show how to represent deques using pairs, and give implementations of the operations. All operations should be accomplished in O(1) steps.
;

;; need to use a doubly linked list for a double-ended-queue

(define (make-queue)
  (define (make-node data)(cons data (cons '() '())))
  (define (node-forward-ptr node)(cddr node))
  (define (set-node-forward-ptr! node ptr)(set-cdr! (cdr node) ptr))
  (define (node-backward-ptr node)(cadr node))
  (define (set-node-backward-ptr! node ptr)(set-car! (cdr node) ptr))
  (define (node-data node)(car node))
  (define (node-print node) (display (node-data node)))
  (let ((front-ptr '())
        (rear-ptr  '()))
    (define (set-front-ptr! item)(set! front-ptr item))
    (define (set-rear-ptr!  item)(set! rear-ptr  item))
    (define (empty-queue?)(null? front-ptr))
    (define (front-queue)
      (if (empty-queue?)
        (error "FRONT called with empty queue")
        (node-data front-ptr)))
    (define (rear-insert-queue! item)
      (let ((new-pair (make-node item)))
        (cond ((empty-queue?)
               (set-front-ptr! new-pair)
               (set-rear-ptr! new-pair))
              (else
                (set-node-forward-ptr! rear-ptr new-pair)
                (set-node-backward-ptr! new-pair rear-ptr)
                (set-rear-ptr! new-pair)))))
    (define (front-insert-queue! item)
      (let ((new-pair (make-node item)))
        (cond ((empty-queue?)
               (set-front-ptr! new-pair)
               (set-rear-ptr! new-pair))
              (else
                (set-node-forward-ptr! new-pair front-ptr)
                (set-node-backward-ptr! front-ptr new-pair)
                (set-front-ptr! new-pair)))))
    (define (front-delete-queue!)
      (cond ((empty-queue?)
             (error "DELETE! called on empty queue"))
            ((eq? front-ptr rear-ptr)
             (set! front-ptr '())
             (set! rear-ptr '()))
            (else
              (let ((next-node (node-forward-ptr front-ptr)))
                (set-node-backward-ptr! next-node '())
                (set-node-forward-ptr! front-ptr '())
                (set! front-ptr next-node)))))
    (define (rear-delete-queue!)
      (cond ((empty-queue?)
             (error "DELETE! called on empty queue"))
            ((eq? front-ptr rear-ptr)
             (set! front-ptr '())
             (set! rear-ptr '()))
            (else
              (let ((prev-node (node-backward-ptr rear-ptr)))
                (set-node-forward-ptr! prev-node '())
                (set-node-backward-ptr! rear-ptr '())
                (set! rear-ptr prev-node)))))
    (define (print-queue)
      (let ((node-iter front-ptr))
        (define (print-node node)
          (cond ((not (eq? node '()))
                 (node-print node)
                 (print-node (node-forward-ptr node)))))
        (print-node node-iter)))
    (define (dispatch m)
      (cond ((eq? m 'empty-queue? )  empty-queue?)
            ((eq? m 'front-insert-queue!) front-insert-queue!)
            ((eq? m 'rear-insert-queue!) rear-insert-queue!)
            ((eq? m 'front-delete-queue!) front-delete-queue!)
            ((eq? m 'rear-delete-queue!) rear-delete-queue!)
            ((eq? m 'front-queue  )   front-queue)
            ((eq? m 'print-queue  )   print-queue)
            (else (error "ERROR"))))
    dispatch))



(define (empty-queue? queue) ((queue 'empty-queue?)))
(define (front-insert-queue! queue item) ((queue 'front-insert-queue!) item))
(define (rear-insert-queue! queue item) ((queue 'rear-insert-queue!) item))
(define (front-delete-queue! queue) ((queue 'front-delete-queue!)))
(define (rear-delete-queue! queue) ((queue 'rear-delete-queue!)))
(define (front-queue queue) ((queue 'front-queue)))
(define (print-queue queue) ((queue 'print-queue)))


;---------------------------------------

(define q1 (make-queue))

(rear-insert-queue! q1 'a)
(rear-insert-queue! q1 'b)
(rear-insert-queue! q1 'c)
(rear-insert-queue! q1 'd)
(rear-insert-queue! q1 'e)
(print-queue q1) (newline)

(front-delete-queue! q1)
(front-delete-queue! q1)
(print-queue q1) (newline)

;---------------------------------------

(define q2 (make-queue))

(front-insert-queue! q2 'a)
(front-insert-queue! q2 'b)
(front-insert-queue! q2 'c)
(front-insert-queue! q2 'd)
(front-insert-queue! q2 'e)
(print-queue q2) (newline)

(front-delete-queue! q2)
(front-delete-queue! q2)
(print-queue q2) (newline)

(rear-delete-queue! q2)
(print-queue q2) (newline)

(rear-insert-queue! q2 'z)
(print-queue q2) (newline)

(front-insert-queue! q2 'a)
(print-queue q2) (newline)