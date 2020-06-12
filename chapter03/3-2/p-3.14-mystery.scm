(define (mystery x)
  
  (define (loop x y)
    (if (null? x)
        y
        (let ((tmp (cdr x)))
          (set-cdr! x y)
          (loop tmp x))))

  (loop x '()))

