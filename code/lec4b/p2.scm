;Complex Number
;z = a + bi

(define (attach-type type z)
   (cons type z))

(define (type z)
   (car z))

(define (contents z)
   (cdr z))

;The Rectangular Form
; real part and imaginary part
(define (make-rectangular a b)
   (cons a b))

(define (real-part-rect z)
   (car z))

(define (imaginary-part-rect z)
   (cdr z))

(define (module-rect z)
   (sqrt
      (+
         (square (real-part-rect z))
         (square (imaginary-part-rect z)))))

(define (angle-rect z)
   (atan
      (/
         (imaginary-part-rect z)
         (real-part-rect z))))

;The Polar Form
;module and angle
(define (make-polar a b)
   (cons a b))

(define (real-part-polar z)
   (*
      (module-polar z)
      (cos (angle-polar z))))

(define (imaginary-part-polar z)
   (*
      (module-polar z)
      (sin (angle-polar z))))

(define (module-polar z)
   (car z))

(define (angle-polar z)
   (cdr z))


(define (log a b)
   (display a)
   (display b)
   (newline))

(log "start" "")   

(define r1 (make-rectangular 3 4))

(log "rectangular r1 " r1)
(log "real part r1 " (real-part-rect r1))
(log "imaginary part r1 " (imaginary-part-rect r1))
(log "module r1 " (module-rect r1))
(log "angle r1 " (angle-rect r1))

(define r2 (make-polar 5 0.9272952180016122))

(newline)
(log "polar r2 " r2)
(log "real part r2 " (real-part-polar r2))
(log "imaginary part r2 " (imaginary-part-polar r2))
(log "module r2 " (module-polar r2))
(log "angle r2 " (angle-polar r2))

; Complex Number Calc
; + - * /

(define (+z z1 z2) '())