(load "interval.scm")

(define (make-center-width c w)
  (make-interval (- c w) (+ c w)))

(define (center i)
  (/ (+ (lower-bound i) (upper-bound i)) 2))

(define (width i)
  (/ (- (upper-bound i) (lower-bound i)) 2))

(define (make-center-percent center percent)
  (let ((value (* center percent)))
    (make-interval (center + value)
                   (center - value))))

(define (percent i)
  (/ (width i) (center i)))