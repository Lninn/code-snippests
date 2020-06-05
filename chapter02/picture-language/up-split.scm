(load "beside.scm")
(load "below.scm")
; 将 图形 向上分割

(define (up-split painter n)
  (if (= n 0)
      painter
      (let ((smaller (up-split painter (- n 1))))
        (below painter (beside smaller smaller)))))