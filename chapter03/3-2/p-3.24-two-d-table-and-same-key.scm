; two d table

(define tolerance 10)

; same key
(define (same-key? key1 key2)
  (< (abs (- key1 key2)) tolerance))

(define (assoc key records)
  (cond ((null? records) false)
        ((same-key? (caar records) key) (car records))
        (else (assoc key (cdr records)))))

(define (make-table)
  (let ((local-table (list '*table*)))
    (define (lookup key1 key2)
      (let ((subtable (assoc key1 (cdr local-table))))
        (if subtable
            (let ((record (assoc key2 (cdr subtable))))
            (if record
                (cdr record)
                false))
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