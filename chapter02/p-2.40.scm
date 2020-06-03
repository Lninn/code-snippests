; p-2.40
(load "../utils/prime.scm")
(load "flatmap.scm")
(load "enumerate-interval.scm")

(define (unique-pairs n)
  (flatmap (lambda (x)
             (map (lambda (p) (list x p))
                  (enumerate-interval 1 (- x 1))))
           (enumerate-interval 1 n)))

(define (prime-sum-pairs n)
  (define (make-pair-sum pair)
    (let ((a (car pair))
          (d (cadr pair)))
      (list a d (+ a d))))
  (define (prime-sum? pair)
    (prime? (+ (car pair) (cadr pair))))
  (map make-pair-sum
       (filter prime-sum?
               (unique-pairs n))))