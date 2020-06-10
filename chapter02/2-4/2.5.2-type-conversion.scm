(load "table.scm")

(define operation-table (make-table))
(define put-coercion (operation-table 'insert-proc!))
(define get-coercion (operation-table 'lookup-proc))

(load "operation-system.scm")

; scheme-number TO rational
(define (scheme-number->rational n)
  (make-rational (contents n) 1))
(put-coercion 'scheme-number 'rational scheme-number->rational)

; rational TO complex
(define (rational->complex r)
  (make-complex-from-real-imag
    (exact->inexact (let ((val (contents r)))
                      (/ (car val) (cdr val))))
    0))
(put-coercion 'rational 'complex rational->complex)

(define (apply-generic op . args)
  (let ((type-tags (map type-tag args)))
    (let ((proc (get op type-tags)))
      (if proc
          (apply proc (map contents args))
          (if (= (length args) 2)
              (let ((type1 (car type-tags))
                    (type2 (cadr type-tags))
                    (a1 (car args))
                    (a2 (cadr args)))
                (let ((t1->t2 (get-coercion type1 type2))
                      (t2->t1 (get-coercion type2 type1)))
                  (cond (t1->t2
                         (apply-generic op (t1->t2 a1) a2))
                        (t2->t1
                         (apply-generic op (t2->t1 a2) a1))
                        (else
                         (error "No method for these types"
                                 (list op type-tags))))))
              (error "No method for these types"
                     (list op type-tags)))))))