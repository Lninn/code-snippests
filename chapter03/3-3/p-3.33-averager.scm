(load "constraint-system.scm")

(define (averager a1 a2 ret)
  
  (define (process-new-value)
    (cond ((and (has-value? a1) (has-value? a2))
           (set-value! ret
                       (/ (+ (get-value a1) (get-value a2)) 2)
                       me))
          ((and (has-value? a1) (has-value? ret))
           (set-value! a2
                       (- (* 2 (get-value ret)) (get-value a1))
                       me))
          ((and (has-value? a2) (has-value? ret))
           (set-value! a1
                       (- (* 2 (get-value ret)) (get-value a2))
                       me))))
  
  (define (process-forget-value)
    (forget-value! a1 me)
    (forget-value! a2 me)
    (forget-value! ret me)
    (process-new-value))

  (define (me request)
    (cond ((eq? request 'I-have-a-value)
           (process-new-value))
          ((eq? request 'I-lost-my-value)
           (process-forget-value))
          (else
           (error "Unknow request -- AVERAGER" request))))
  
  (connect a1 me)
  (connect a2 me)
  (connect ret me)
  me)

(define a (make-connector))
(define b (make-connector))
(define c (make-connector))

(probe "a" a)
(probe "b" b)
(probe "c" c)

(averager a b c)