(load "../vect.scm")
(load "escher-frame.scm")
(load "frame-coord-map.scm")

(define (transform-painter painter origin corner1 corner2)
  (lambda (frame)
    (let ((m (frame-coord-map frame)))
      (let ((new-origin (m origin)))
        (painter
         (make-frame new-origin
                     (sub-vect (m corner1) new-origin)
                     (sub-vect (m corner2) new-origin)))))))


(define frame (make-frame (make-vect 0 0)
                          (make-vect 1 0)
                          (make-vect 0 1)))

(define width 384)
(define height 384)

(define (offset-x x)
  (* x width))

(define (offset-y y)
  (* (- 1 y) height))

(define (offset-vx x) (* x width))
(define (offset-vy y) (* y height))

(define painter
  (lambda (frame)
    (let ((o (origin-frame frame))
          (e1 (edge1-frame frame))
          (e2 (edge2-frame frame)))
      (newline)
      (display o)
      (display " ")
      (display e1)
      (display " ")
      (display e2)
      )))

((transform-painter painter
                    (make-vect 0 0)
                    (make-vect 1 0)
                    (make-vect 0 1))
 frame)