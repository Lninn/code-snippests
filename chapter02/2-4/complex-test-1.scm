(load "table.scm")

(define operation-table (make-table))

(define get (operation-table 'lookup-proc))
(define put (operation-table 'insert-proc!))

(load "type.scm")
(load "polar-pkg.scm")
(load "rectangular-pkg.scm")
(load "complex-pkg.scm")
(load "complex.scm")

(install-polar-package)
(install-rectangular-package)

(define z1 (make-from-real-imag 3 4))

(define z2 (make-from-real-imag 7 10))

(define z3 (make-from-mag-ang 20 5))