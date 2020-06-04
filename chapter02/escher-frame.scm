; 通过三个向量构建一个框架
(define (make-frame origin edge1 edge2)
  (cons origin (cons edge1 edge2)))

; Selector Proc
(define (origin-frame f)
  (car f))

(define (edge1-frame f)
  (cadr f))

(define (edge2-frame f)
  (cddr f))

