(load "cons-complex-rect.scm")
(load "cons-complex-polar.scm")

; 基于类型的分派
(define (real-part z)
  (cond ((rectangular? z)
         (real-part-rectangular (contents z)))
        ((polar? z)
         (real-part-polar (contents z)))
        (else (error "Unknow type -- REAL-PART" z))))

(define (imag-part z)
  (cond ((rectangular? z)
         (imag-part-rectangular (contents z)))
        ((polar? z)
         (imag-part-polar (contents z)))
        (else (error "Unknow type -- IMAG-PART" z))))

(define (magniutde z)
  (cond ((rectangular? z)
         (magniutde-rectangular (contents z)))
        ((polar? z)
         (magniutde-polar (contents z)))
        (else (error "Unknow type -- MAGNIUTDE" z))))

(define (angle z)
  (cond ((rectangular? z)
         (angle-rectangular (contents z)))
        ((polar? z)
         (angle-polar (contents z)))
        (else (error "Unknow type -- ANGLE" z))))

; Constructor
(define (make-from-real-imag x y)
  (make-from-real-imag-rectangular x y))

(define (make-from-mag-ang r a)
  (make-from-mag-ang-polar r a))