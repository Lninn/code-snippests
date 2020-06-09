(define (apply-generic op arg) (arg op))

(define (make-from-real-imag x y)
  (define (dispatch op)
    (cond ((eq? op 'real-part) x)
          ((eq? op 'imag-part) y)
          ((eq? op 'magnitude)
           (sqrt (+ (square x) (square y))))
          ((eq? op 'angle) (atan y x))
          (else
           (error "Unknow op -- MAKE-FROM-REAL-IMAG" op))))
  dispatch)

(define (make-from-mag-ang r a)
  (define (dispatch op)
    (cond ((eq? op 'real-part) (* r (cos a)))
          ((eq? op 'imag-part) (* r (sin a)))
          ((eq? op 'magnitude) r)
          ((eq? op 'angle) a)
          (else
           (error "Unknow op -- MAKEF-FROM-MAG-ANG" op)))))

(define (real-part z)
  (apply-generic 'real-part z))

(define (imag-part z)
  (apply-generic 'imag-part z))

(define (magnitude z)
  (apply-generic 'magnitude z))

(define (angle z)
  (apply-generic 'angle z))

(load "complex.scm")

(define (print-complex z)
  (newline)
  (display (real-part z))
  (display " + ")
  (display (imag-part z))
  (display "i"))

; Usage

(define z1 (make-from-real-imag 3 4))

(define z2 (make-from-real-imag 5 6))
