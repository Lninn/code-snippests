(load "2.5.2-type-conversion.scm")

; 基本的转换过程
; scheme-number TO rational
(define (scheme-number->rational n)
  (make-rational (contents n) 1))
(put-coercion 'scheme-number 'raise scheme-number->rational)

; rational TO complex
(define (rational->complex r)
  (make-complex-from-real-imag
    (exact->inexact (let ((val (contents r)))
                      (/ (car val) (cdr val))))
    0))
(put-coercion 'rational 'raise rational->complex)

; 通过的 raise 操作
; 完成对数据对象的 强制类型转换，向上提升

(define (raise object)
  (let ((proc (get-coercion (type-tag object) 'raise)))
    (if proc
        (proc object)
        object)))