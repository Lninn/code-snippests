(load "stream.scm")
(load "prime.scm")

#|
(stream-car
  (stream-cdr
    (stream-filter prime?
                   (stream-enumerate-interval 10000 1000000))))

10009
|#
