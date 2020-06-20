; 243

(load "stream.scm")

(define (stream-map proc . argstreams)
  (if (stream-null? (car argstreams))
      the-empty-stream
      (cons-stream
       (apply proc (map stream-car argstreams))
       (apply stream-map
              (cons proc (map stream-cdr argstreams))))))

(define s1 (stream-enumerate-interval 1 5))
(define s2 (stream-enumerate-interval 10 15))
(define s3 (stream-enumerate-interval 100 105))

(define ret (stream-map + s1 s2 s3))
(display-stream ret)