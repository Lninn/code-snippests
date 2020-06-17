; queue
; 表示为一个带有头指针和尾指针的序列


; 基本操作
; (make-queue)
; (empty-queue? <queue>)
; (front-queue <queue>)
; (insert-queue! <queue> <item>)
; (delete-queue! <queue>)


(define (front-ptr queue)
  (car queue))

(define (rear-ptr queue)
  (cdr queue))

(define (set-front-ptr! queue item)
  (set-car! queue item))

(define (set-rear-ptr! queue item)
  (set-cdr! queue item))


(define (make-queue) (cons '() '()))

(define (empty-queue? queue)
  (null? (front-ptr queue)))

(define (insert-queue! queue item)
  (let ((obj (cons item '())))
    (cond ((empty-queue? queue)
           (set-front-ptr! queue obj)
           (set-rear-ptr! queue obj)
           queue)
          (else
           (set-cdr! (rear-ptr queue) obj)
           (set-rear-ptr! queue obj)
           queue))))

(define (front-queue queue)
  (if (empty-queue? queue)
      (error "FRONT called with an empty queue" queue)
      (car (front-ptr queue))))

(define (delete-queue! queue)
  (cond ((empty-queue? queue)
         (error "DELETE! called with an empty queue" queue))
        (else
         (set-front-ptr!
           queue
           (cdr (front-ptr queue)))
           queue)))