(load "stream.scm")

(define a (stream-enumerate-interval 1 5))

(define b (stream-enumerate-interval 10 15))

(define c (stream-enumerate-interval 100 105))

(define (stream-map proc . argstreams)
  (if (stream-null? (car argstreams))
      the-empty-stream
      (cons-stream
        (apply proc (map stream-car argstreams))
        (apply stream-map
               (cons proc (map stream-cdr argstreams))))))

(define ret (stream-map + a b c))

(display-stream ret)
