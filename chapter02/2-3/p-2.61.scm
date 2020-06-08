; 将元素 x 加入到给定的集合 s 中，如果元素 x 不存在于集合 s
; 集合是升序的

(load "element-of-set.scm")

(define (addjoin-set x set)
  (if (element-of-set? x set)
      set
      (cons x set)))