; queue
; 将 队列 表示为由一个指向常规列表的开始和结束指针组成

(load "3.3.2-queue.scm")
(load "p-3.21-print-queue.scm")

(define (make-queue)
  (let ((front-ptr '())
        (rear-ptr '()))

    (define (set-front-ptr! new-pair)
      (set! front-ptr new-pair))

    (define (set-rear-ptr! new-pair)
      (set! rear-ptr new-pair))

    (define (dispatch m)
      (cond ((eq? 'front-ptr m)
             front-ptr)
            ((eq? 'rear-ptr m)
             rear-ptr)
            ((eq? 'set-front-ptr! m)
             set-front-ptr!)
            ((eq? 'set-rear-ptr! m)
             set-rear-ptr!)))
    dispatch))

(define (front-ptr queue)
  (queue 'front-ptr))

(define (rear-ptr queue)
  (queue 'rear-ptr))

(define (set-front-ptr! queue item)
  ((queue 'set-front-ptr!) item))

(define (set-rear-ptr! queue item)
  ((queue 'set-rear-ptr!) item))


; Usage
(define q (make-queue))

(insert-queue! q 'a)
(insert-queue! q 'b)
(insert-queue! q 'c)
(insert-queue! q 'd)
