(load "../utils/print-value.scm")
(load "perimeter-and-area-of-rect.scm")

; (load "rect-01.scm")
; (define r1 (make-rect 4 6))

; (print-value "perimeter" (perimeter-of-rect r1))
; (print-value "area" (area-of-rect r1))

(load "rect-02.scm")
(define r1 (make-rect (make-point 0 0)
                      (make-point 8 0)
                      (make-point 0 4)))

(print-value "perimeter" (perimeter-of-rect r1))
(print-value "area" (area-of-rect r1))
