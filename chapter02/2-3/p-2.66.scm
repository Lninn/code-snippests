(load "tree.scm")

(define (lookup given-key set-of-records)
  (if (null? set-of-records)
      false
      (cond ((= given-key (entry set-of-records))
             (entry set-of-records))
            ((< given-key (entry set-of-records))
             (lookup given-key (left-branch set-of-records)))
            ((> given-key (entry set-of-records))
             (lookup given-key (right-branch set-of-records))))))

(define tree
  (make-tree
   7
   (make-tree
    3
    (make-tree 1 '() '())
    (make-tree 5 '() '()))
   (make-tree
    9
    '()
    (make-tree 11 '() '()))))