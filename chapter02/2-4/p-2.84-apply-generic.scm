(load "p-2.83-raise.scm")

; 通过将 raise 过程加入到 apply-generic 中
; 通过逐层提升的方式将参数强制到同样的类型

(put-coercion 'scheme-number 'level 1)
(put-coercion 'rational 'level 2)
(put-coercion 'complex 'level 3)

(define (apply-generic op . args)
  (let ((type-tags (map type-tag args)))
    (let ((proc (get op type-tags)))
      (if proc
          (apply proc (map contents args))
          (let ((result (convert args)))
            (if result
                (apply apply-generic (cons op result))
                (error "No method for these types"
                       (list op type-tags))))))))

; 强制把 args 中所有的元素都转换为其中优先级最大的元素类型
(define (convert args)
  
  (define type-list (map type-tag args))

  ; 找到 list 中的最大的元素
  (define (help proc list)
    (define (iter rest ret)
        (cond ((null? rest) ret)
            ((> (proc (car rest)) (proc ret))
            (iter (cdr rest) (car rest)))
            (else (iter (cdr rest) ret))))
    (iter (cdr list) (car list)))
  
  ; 查看 elements 中的所有的元素的类型是否都为 target-type
  (define (same-type? target-type elements)
    (every (lambda (result)
             (not (false? result)))
           (map (lambda (current-type)
                  (equal? target-type current-type))
                (map type-tag elements))))

  ; 把 elements 中的所有元素都转换为 target-type
  (define (todo target-type elements)
    (if (same-type? target-type elements)
        elements
        (todo target-type
              (map
                (lambda (element)
                  (if (equal? target-type (type-tag element))
                      element
                      (raise element)))
                elements))))

  ; 获取对应 type 的优先级
  (define (get-level type) (get-coercion type 'level))
  
  (define (try)
    (let ((target-type (help get-level type-list)))
      (todo target-type args)))

  (try))
