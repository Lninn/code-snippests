; 扩展 apply-generic 过程的功能
; 使其可以处理多个参数的强制转换

; 一种可行的方式：
; 1 试着将所有的参数转换为第一个参数的类型，如果失败
; 2 试着强制到第二个参数，依次类推，直到最后
;
; 判断两个类型之间是否可以转换的规则是，通过查看 get-coercion 
; 中是否存在相应的过程，如果不存在，返回 false
;

(define (coercion-all args)
  
  (define (iter elements)
    (if (null? elements)
        false
        (let ((current-element (car elements)))
          (let ((current-type (type-tag current-element)))
            (let ((result (try-it current-type args)))
              (if result
                  result
                  (iter (cdr elements))))))))

  (define (try-it target-type elements)
    (if (all-types-will-ok? target-type (map type-tag elements))
        (map
         (lambda (element)
           (if (equal? target-type (type-tag element))
               element
               ((get-coercion (type-tag element) target-type)
                element)))
         elements)
        false))

  (define (all-types-will-ok? target-type type-list)
    (every
     (lambda (result)
       (not (false? result)))
     (map (lambda (origin-type)
            (get-coercion origin-type target-type))
          (remove (lambda (current-type)
                    (equal? current-type target-type))
                  type-list))))

  (iter args))

(define (apply-generic op . args)
  (let ((type-tags (map type-tag args)))
    (let ((proc (get op type-tags)))
      (if proc
          (apply proc (map contents args))
          (let ((result (coercion-all args)))
            (if result
                (apply apply-generic (cons op result))
                (error "No method for these types"
                       (list op type-tags))))))))