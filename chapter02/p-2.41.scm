; p-2.41

(load "enumerate-interval.scm")
(load "permutations.scm")

; 三层
(define (unique-tuples n)
  (flatmap
   (lambda (x)
     (flatmap
      (lambda (p)
        (map (lambda (j) (list x p j))
             (enumerate-interval 1 (- p 1))))
      (enumerate-interval 1 (- x 1))))
   (enumerate-interval 1 n)))

(define (sum-tuples n)
  (define (equal-n? tuple)
    (= n (+ (car tuple) (cadr tuple) (caddr tuple))))
  (filter equal-n?
          (unique-tuples n)))
