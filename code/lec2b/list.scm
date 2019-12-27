(define log
   (lambda (desc n)
      (display desc)
      (display n)
      (newline)))
  

(define map
   (lambda (p l)
      (if (null? l)
         '()
         (cons
            (p (car l))
            (map p (cdr l))))))


(define map-2
   (lambda (p l)
      (define iter
         (lambda (l r)
            (if (null? l)
               r
               (iter
                  (cdr l)
                  (cons (p (car l)) r)))))
      (iter l ())))


(define each-add-1
   (lambda (l)
      (define iter
         (lambda (l r)
            (if (null? l)
               r
               (iter (cdr l) (cons (+ (car l) 1) r)))))
      (iter l ())))


(define l1 (list 1 2 3 4))    

(define plus10
   (lambda (n) (+ n 10)))

(define l2 (map plus10 l1))

(define l3 (map-2
   (lambda (n) (* n 10)) l1))

(define l4 (each-add-1 l1))


(log "init: " l1)
(log "mul10: " l3)
(log "add10: " l2)
(log "each-add-1: " l4)


; 1 2 3 4