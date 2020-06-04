; (beside a b)
; 将 a 放在框架的左边，b 放在框架的右边，产生一个新的画家

; (below a b)
; 将 a 放在框架的下面，b 放在框架的上面，产生一个新的画家

; (flip-vert a)
; 将 a 在垂直方向上翻转

; (flip-horiz a)
; 将 a 在水平方向上翻转

(define (flipped-pairs painter)
  (let ((painter2 (beside painter (flip-vert painter))))
    (below painter2 painter2)))

(define wave 0)
(define wave4 (flipped-pairs wave))

; 在图形的右边做分割
(defnie (right-split painter n)
  (if (= n 0)
      painter
      (let ((smaller (right-split painter (- n 1))))
        (beside painter (below smaller smaller)))))

; 在图形的上边做分割
(define (up-split painter n)
  (if (= n 0)
      painter
      (let ((smaller (up-split painter (- n 1))))
        (below painter (beside smaller smaller)))))

; p-2.45
(define (split a b)
  (define iter (lambda (painter n)
    (if (= n 0)
        painter
        (let ((smaller (iter painter (- n 1))))
          (a painter (b smaller smaller))))))
  iter)

; 同时在图形中向上和向右分支
(define (corner-split painter n)
  (if (= n 0)
      painter
      (let ((up (up-split painter (- n 1)))
            (right (right-split painter (- n 1))))
        (let ((top-left (beside up up))
              (bottom-right (below right right))
              (corner (corner-split painter (- n 1))))
          (beside (below painter top-left)
                  (below bottom-right corner))))))

(define (square-limit painter n)
  (let ((quarter (corner-split painter n)))
    (let ((half (beside (flip-horiz quarter) quarter)))
      (below (flip-vert half) half))))