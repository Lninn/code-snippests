(load "table.scm")

(define operation-table (make-table))
(define get (operation-table 'lookup-proc))
(define put (operation-table 'insert-proc!))

(load "apply-generic.scm")

; common op
(define (add x y) (apply-generic 'add x y))
(define (sub x y) (apply-generic 'sub x y))
(define (mul x y) (apply-generic 'mul x y))
(define (div x y) (apply-generic 'div x y))


(define (install-scheme-number-package)
  (define (tag x)
    (attach-tag 'scheme-number x))
  (put 'add '(scheme-number scheme-number)
       (lambda (x y) (tag (+ x y))))
  (put 'sub '(scheme-number scheme-number)
       (lambda (x y) (tag (- x y))))
  (put 'mul '(scheme-number scheme-number)
       (lambda (x y) (tag (* x y))))
  (put 'div '(scheme-number scheme-number)
       (lambda (x y) (tag (/ x y))))
  (put 'make 'scheme-number
       (lambda (x) (tag x)))
  'ok)

(define (make-scheme-number n)
  ((get 'make 'scheme-number) n))


(define (install-rational-package)
 ;;internal procedures
  (define (denom x) (cdr x))
  (define (numer x) (car x))
  (define (make-rat n d)
    (let ((g (gcd n d)))
      (cons (/ n g) (/ d g))))
  (define (add x y)
    (make-rat (+ (* (numer x) (denom y))
                 (* (numer y) (denom x)))
              (* (denom x) (denom y))))
  (define (sub x y)
    (make-rat (- (* (numer x) (denom y))
                 (* (numer y) (denom x)))
              (* (denom x) (denom y))))
  (define (mul x y)
    (make-rat (* (numer x) (numer y))
              (* (denom x) (denom y))))
  (define (div x y)
    (make-rat (* (numer x) (denom y))
              (* (denom x) (numer y))))
 ;;interface to rest of the system
  (define (tag x) (attach-tag 'rational x))
  (put 'add '(rational rational)
       (lambda (x y) (tag (add x y))))
  (put 'sub '(rational rational)
       (lambda (x y) (tag (sub x y))))
  (put 'mul '(rational rational)
       (lambda (x y) (tag (mul x y))))
  (put 'div '(rational rational)
       (lambda (x y) (tag (div x y))))
  (put 'make 'rational
       (lambda (n d) (tag (make-rat n d))))
  'ok)

(define (make-rational n d)
  ((get 'make 'rational) n d))

(load "type.scm")
(load "rectangular-pkg.scm")
(load "polar-pkg.scm")
(load "complex-pkg.scm")

(install-polar-package)
(install-rectangular-package)

(define (install-complex-package)
 ;; imported procedures from rectangular and polar packages
  (define (make-from-real-imag x y)
    ((get 'make-from-real-imag '(rectangular)) x y))
  (define (make-from-mag-ang r a)
    ((get 'make-from-mag-ang '(polar)) r a))
 ;; internal procedures
  (define (add z1 z2)
    (make-from-real-imag (+ (real-part z1) (real-part z2))
                         (+ (imag-part z1) (imag-part z2))))
  (define (sub z1 z2)
    (make-from-real-imag (- (real-part z1) (real-part z2))
                         (- (imag-part z1) (imag-part z2))))
  (define (mul z1 z2)
    (make-from-mag-ang (* (magnitude z1) (magnitude z2))
                       (+ (angle z1) (angle z2))))
  (define (div z1 z2)
    (make-from-mag-ang (/ (magnitude z1) (magnitude z2))
                       (- (angle z1) (angle z2))))
 ;; interface to rest of the system
  (define (tag z) (attach-tag 'complex z))
  (put 'add '(complex complex)
       (lambda (z1 z2) (tag (add z1 z2))))
  (put 'sub '(complex complex)
       (lambda (z1 z2) (tag (sub z1 z2))))
  (put 'mul '(complex complex)
       (lambda (z1 z2) (tag (mul z1 z2))))
  (put 'div '(complex complex)
       (lambda (z1 z2) (tag (div z1 z2))))
  (put 'make-from-real-imag 'complex
       (lambda (x y) (tag (make-from-real-imag x y))))
  (put 'make-from-mag-ang 'complex
       (lambda (r a) (tag (make-from-mag-ang r a))))
  (put 'real-part '(complex) real-part)
  (put 'imag-part '(complex) imag-part)
  (put 'magnitude '(complex) magnitude)
  (put 'angle '(complex) angle)
  'ok)

(define (make-complex-from-real-imag x y)
  ((get 'make-from-real-imag 'complex) x y))

(define (make-complex-from-mag-ang r a)
  ((get 'make-from-mag-ang 'complex) r a))


; Useage
(install-scheme-number-package)
(install-rational-package)
(install-complex-package)