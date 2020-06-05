(load "beside.scm")
(load "below.scm")
(load "flip-vert.scm")
(load "flip-horiz.scm")
(load "../utils/compose.scm")

(define (square-of-four tl tr bl br)
  (lambda (painter)
    (let ((top (beside (tl painter) (tr painter)))
          (bottom (beside (bl painter) (br painter))))
      (below bottom top))))

(define (flipped-pairs painter)
  (define (identity p) p)
  (let ((combine4 (square-of-four identity flip-vert
                                  identity flip-vert)))
    (combine4 painter)))

(define (rotate180 painter)
  ((compose flip-vert flip-horiz) painter))

(define (square-limit painter n)
  (define (identity p) p)
  (let ((combine4 (square-of-four flip-horiz identity
                                  rotate180 flip-vert)))
    (combine4 (corner-split painter n)))
  )