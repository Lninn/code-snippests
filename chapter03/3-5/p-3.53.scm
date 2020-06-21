(load "add-stream.scm")

(define s (cons-stream 1 (add-stream s s)))

; 1 2 4 8 16 ...
