(define (display-line x)
  (newline)
  (display x))

(define (display-stream s)
  (stream-for-each display-line s))