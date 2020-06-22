(load "add-stream.scm")
(load "display-stream.scm")

(define fibs
  (cons-stream 0
               (cons-stream 1
                            (add-stream (stream-cdr fibs)
                                        fibs))))