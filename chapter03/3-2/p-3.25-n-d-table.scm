; N d table

(define (assoc key records)
  (cond ((null? records) false)
        ((equal? (caar records) key) (car records))
        (else (assoc key (cdr records)))))

(define (iter keys value)
  (if (= 1 (length keys))
      (cons (car keys) value)
      (list (car keys) (iter (cdr keys) value))))

(define (lookup keys table)
  (let ((filter-data (find keys (cdr table) table)))
    (let ((filter-keys (car filter-data))
          (filter-table (cdr filter-data)))
      (cond ((= (length keys) (length filter-keys)) false)
            (else (if (= 0 (length filter-keys)) (cdr filter-table) false))))))

(define (find keys records last)
  (if (null? keys)
      (cons (list) last)
      (let ((record (assoc (car keys) records)))
        (if record
            (find (cdr keys) (cdr record) record)
            (cons keys last)))))

(define (insert! keys value table)
  (let ((filter-data (find keys (cdr table) table)))
    (let ((filter-keys (car filter-data))
          (filter-table (cdr filter-data)))
      (cond ((= 0 (length filter-keys))
             (set-cdr! filter-table value)
             )
            (else
             (set-cdr! filter-table (cons (iter filter-keys value)
                                          (cdr filter-table))))))))

(define (make-table) (list '*table*))

(define t1 (make-table))

(insert! (list 'a01 'b01 'c01) 101 t1)
(insert! (list 'a02 'b02 'c02) 102 t1)
(insert! (list 'a03 'b03 'c03) 103 t1)
(insert! (list 'a03 'b03 'c03) 301 t1)
(insert! (list 'a01 'b02 'c01) 201 t1)
(insert! (list 'name) 'join t1)
(insert! (list 'name) 'join2 t1)
(insert! (list 'school 'grade) 1 t1)

(lookup (list 'a03 'b03 'c01) t1)