; 计算矩形的周长
(define (perimeter-of-rect rect)
  (* (width-of-rect rect)
     (height-of-rect rect)))

; 计算矩形的面积
(define (area-of-rect rect)
  ( / (+ (width-of-rect rect)
         (height-of-rect rect))
      2.0))