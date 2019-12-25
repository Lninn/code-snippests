(define pi (* 4 (atan 1.0)))

(define ang-to-rad
    (lambda (angle)
        (* angle (/ pi 180))))

(define v0 10)
(define length
    (lambda (time)
        (* v0 time)))