; 返回表 items 中的第 n 个元素
(define (list-ref items n)
  (if (= n 0)
      (car items)
      (list-ref (cdr items) (- n 1))))

; 返回表 items 的长度
(define (length items)
  (if (null? items)
      0
      (+ 1 (length (cdr items)))))

(define (length items)
  (define (length-iter a count)
    (if (null? a)
        count
        (length-iter (cdr a) (+ 1 count))))
  (length-iter items 0))

; 链接两个表
; 其实就是把 list1 中的元素重新构建一次，但是最后要把 list2 加在新序列的后面
; list 的构建规则是 car 指向具体的值，cdr 指向下一个元素
(define (append list1 list2)
  (if (null? list1)
      list2
      (cons (car list1) (append (cdr list1) list2))))


; 对面表的映射
(define (scale-list items factor)
  (if (null? items)
      '()
      (cons (* factor (car items))
            (scale-list (cdr items) factor))))


; Usage
(define squares (list 1 4 9 16 25))

(define odds (list 1 3 5 7))
