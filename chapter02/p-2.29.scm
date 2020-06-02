; 二叉活动体
(define (make-mobile left right)
  (list left right))

(define (left-branch x)
  (car x))

(define (right-branch x)
  (cadr x))

(define (make-branch length structure)
  (list length structure))

(define (branch-length x)
  (car x))

(define (branch-structure x)
  (cadr x))

(define (total-weight x)
  (let ((length (branch-length x)))
    (cond ((null? x) 0)
          ((number? length)
           (let ((s (branch-structure x)))
              (if (number? s) s (total-weight s))))
          (else
           (let ((left (left-branch x))
                 (right (right-branch x)))
              (+ (total-weight left)
                 (total-weight right)))))))

(define m1
  (make-mobile (make-branch 1 2)
               (make-branch 8 4)))

(define m2
  (make-mobile (make-branch 1 2)
               (make-branch 3 4)))

(define m3
  (make-mobile m1
               m2))

(define (torque x)
  (let ((length (branch-length x)))
    (cond ((null? x) 0)
          ((number? length)
           (let ((s (branch-structure x)))
              (if (number? s) (* s length) (torque s))))
          (else
           (let ((left (left-branch x))
                 (right (right-branch x)))
              (+ (torque left)
                 (torque right)))))))

(define (blance? x)
  (let ((length (branch-length x)))
    (cond ((null? x) true)
          ((number? length)
           true)
          (else
           (let ((left (torque (left-branch x)))
                 (right (torque (right-branch x))))
              (= left right))))))