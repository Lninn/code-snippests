(load "../vect.scm")
(load "escher-frame.scm")

(define (frame-coord-map frame)
  (lambda (v)
    (add-vect
     (origin-frame frame)
     (add-vect (scale-vect (xcor v)
                           (edge1-frame frame))
               (scale-vect (ycor v)
                           (edge2-frame frame))))))


(define frame (make-frame (make-vect 0 0)
                          (make-vect 1 0)
                          (make-vect 0 1)))