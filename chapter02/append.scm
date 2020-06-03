; 链接两个表
; 其实就是把 list1 中的元素重新构建一次，但是最后要把 list2 加在新序列的后面
; list 的构建规则是 car 指向具体的值，cdr 指向下一个元素
(define (append list1 list2)
  (if (null? list1)
      list2
      (cons (car list1) (append (cdr list1) list2))))