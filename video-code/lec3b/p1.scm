; derivative rules
;     C' -> 0
;     X' -> 1
;    CX' -> C
; u +- v -> u' +- v'
;  u * v -> u'v + v'u
;  u / v -> (u'v - v'u) / v * v


(define (atom? exp)
   (and (not (null? exp))
        (not (pair? exp))))


(define (constant? exp var)
   (and (atom? exp)
        (not (eq? exp var))))


(define (same-var? exp var)
   (and (atom? exp)
        (eq? exp var)))


(define (sum? exp)
   (and
      (not (atom? exp))
      (eqv? '+ (car exp))))


(define (sub? exp)
   (and
      (not (atom? exp))
      (eqv? '- (car exp))))     


(define (product? exp)
   (and
      (not (atom? exp))
      (eqv? '* (car exp)))) 


(define (division? exp)
   (and
      (not (atom? exp))
      (eqv? '/ (car exp))))         


(define (A1 exp)
   (cadr exp))


(define (A2 exp)
   (caddr exp))


(define (make-sum a1 a2)
   (cond
      ((and (number? a1) (number? a2)) (+ a1 a2))
      ((and (number? a1) (= a1 0)) a2)
      ((and (number? a2) (= a2 0)) a1)
      (else (list '+ a1 a2))))


(define (make-sub a1 a2)
   (cond
      ((and (number? a1) (number? a2)) (- a1 a2))
      (else (list '- a1 a2))))


(define (M1 exp)
   (cadr exp))


(define (M2 exp)
   (caddr exp))


(define (make-product m1 m2)
   (cond
      ((and (number? m1) (number? m2)) (* m1 m2))
      ((and (number? m1) (= m1 0)) 0)
      ((and (number? m2) (= m2 0)) 0)
      ((and (number? m1) (= m1 1)) m2)
      ((and (number? m2) (= m2 1)) m1)
      (else (list '* m1 m2))))


(define (D1 exp)
   (cadr exp))


(define (D2 exp)
   (caddr exp))   


(define (make-division d1 d2)
   (list '/ d1 d2))


(define (deriva exp var)
   (cond ((constant? exp var) 0)
         ((same-var? exp var) 1)
         ((sum? exp)
            (make-sum
               (deriva (A1 exp) var)
               (deriva (A2 exp) var)))
         ((product? exp)
            (make-sum
               (make-product
                  (M1 exp)
                  (deriva (M2 exp) var))
               (make-product
                  (M2 exp)
                  (deriva (M1 exp) var))))
         ((sub? exp)
            (make-sub
               (deriva (A1 exp) var)
               (deriva (A2 exp) var)))
         ((division? exp)
            (make-division
               (make-sub
                  (make-product
                        (deriva (D1 exp) var)
                        (D2 exp))
                  (make-product
                        (deriva (D2 exp) var)
                        (D1 exp)))
               (* (D2 exp) (D2 exp))))))


(define foo
   '(+
      (* a (* x x))
      (+
         (* b x)
         c)))

(define bar
   '(+
      (* 2 x)
      3))

(define baz
   '(-
      (* 3 (* x x))
      (-
         (* 5 x)
         9)))

(define foo2
   '(/
      (* x x)
      3))

(newline)
(display "start")

(newline)
(display (deriva foo 'x))
(newline)

(display (deriva bar 'x))
(newline)

(display (deriva baz 'x))
(newline)

(display (deriva foo2 'x))
(newline)