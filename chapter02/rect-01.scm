(define (make-rect width height)
  (cons width height))

(define (width-of-rect r)
  (car r))

(define (height-of-rect r)
  (cdr r))
