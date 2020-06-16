; two d table

(define (assoc key records)
  (cond ((null? records) false)
        ((equal? (caar records) key) (car records))
        (else (assoc key (cdr records)))))

(define (lookup key1 key2 key3 table)
  (let ((sub1 (assoc key1 (cdr table))))
    (if sub1
        (let ((sub2 (assoc key2 (cdr sub1))))
          (if sub2
              (let ((sub3 (assoc key3 sub2)))
                (if sub3
                    (cdr sub3)
                    false)
                )
              false)
          )
        false)
    )
  )


(define (insert! key1 key2 key3 value table)
  (let ((sub1 (assoc key1 (cdr table))))
    (if sub1
        (let ((sub2 (assoc key2 (cdr sub1))))
          (if sub2
              (let ((sub3 (assoc key3 (cdr sub2))))
                (if sub3
                    (set-cdr! sub3 value)
                    <set>))
              <set>))
        <set>)))


(define (insert! keys value table)
  ; 查找 table 中对应的 keys 记录

  ; 新增：如果全部都没有或者只找到了部分 key，返回剩余的 key 和 已经核验过的 records
  ; 修改：如果全部都找到了，返回 空的列表和最终的 record
  )



(define (find keys records)
  (if (null? keys)
      records
      (find (cdr keys) (assoc (car keys records)))))

(define (make-table)
  (let ((local-table (list '*table*)))

    (define (lookup keys)
      (let ((record (find keys (cdr local-table))))
        (if record
            (cdr record)
            false)))

    (define (insert! key1 key2 value)
      (let ((subtable (assoc key1 (cdr local-table))))
        (if subtable
            (let ((record (assoc key2 (cdr subtable))))
            (if record
                (set-cdr! record value)
                (set-cdr! subtable
                            (cons (cons key2 value)
                                (cdr subtable)))))
            (set-cdr! local-table
                    (cons (list key1
                                (cons key2 value))
                            (cdr local-table)))))
      'ok)

    (define (dispatch m)
      (cond ((eq? m 'lookup-proc) lookup)
            ((eq? m 'insert-proc!) insert!)
            (else (error "Unknow operation -- TABLE" m))))

    dispatch))

(define operation-table (make-table))
(define get (operation-table 'lookup-proc))
(define put (operation-table 'insert-proc!))

; (put 'letter 'a 97)
; (put 'letter 'b 98)
; (put 'math '+ 40)
; (put 'math '- 41)

; (get 'letter 'a)
; (get 'math '+)

; n-d
; (put (list 'letter 'a) 97)
; (put (list 'math '+ '- '- '/) '40414243)
; (put (list 'name) 'hello-world)

; (get (list 'letter 'a))
; (get (list 'math '+ '- '* '/))
; (get (list 'name))