(load "../chapter02/vect.scm")
(load "transform-painter.scm")

; params p 画家 p
; return new-p 由 p 水平翻转后的新画家

(define (flip-horiz painter)
  (transform-painter painter
                     (make-vect 1.0 0.0)
                     (make-vect 0.0 0.0)
                     (make-vect 1.0 1.0)))