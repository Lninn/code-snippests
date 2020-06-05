(load "beside.scm")
(load "below.scm")

; 在图形的右边做分割
(define (right-split painter n)
  (if (= n 0)
      painter
      (let ((smaller (right-split painter (- n 1))))
        (beside painter (below smaller smaller)))))

(define (right-split painter n)
  (if (= n 0)
      painter
      (let ((smaller (right-split painter (- n 1))))
        (beside painter (below smaller smaller)))))

; (right-split painter 3)
; ↓
; (beside painter (below (right-split painter 2)
;                        (right-split painter 2)))
; ↓
; (beside
;    painter
;    (below (beside
;             painter
;             (below (right-split painter 1)
;                    (right-split painter 1)))
;          (beside
;             painter
;             (below (right-split painter 1)
;                    (right-split painter 1)))))
; ↓
;
;