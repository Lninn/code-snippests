(load "../gcd.scm")

(define (make-rat numer demon)
   (let ((g (gcd numer demon)))
      (cons
         (/ numer g)
         (/ demon g))
      ))

(define (numer rat)
   (car rat))

(define (demon rat)
   (cdr rat))

(define (+rat r1 r2)
   (make-rat
      (+
         (* (numer r1) (demon r2))
         (* (numer r2) (demon r1)))
      (* (demon r1) (demon r2))))

(define (-rat r1 r2)
   (make-rat
      (-
         (* (numer r1) (demon r2))
         (* (numer r2) (demon r1)))
      (* (demon r1) (demon r2))))


(define (*rat r1 r2)
   (make-rat
      (* (numer r1) (numer r2))
      (* (demon r1) (demon r2))))


(define (/rat r1 r2)
   (make-rat
      (* (numer r1) (demon r2))
      (* (demon r1) (numer r2))))


(define (log a b)
   (display a)
   (display b)
   (newline))

(define r1 (make-rat 2 5))
(define r2 (make-rat 3 5))

(define r3 (make-rat 4 5))
(define r4 (make-rat 2 3))

(newline)
(log "r1 " r1)
(log "r2 " r2)
(log "r1 + r2 " (+rat r1 r2))
(log "r1 - r2 " (-rat r1 r2))
(log "r1 * r2 " (*rat r1 r2))
(log "r1 / r2 " (/rat r1 r2))

(newline)
(log "r3 " r3)
(log "r4 " r4)
(log "r3 + r4 " (+rat r3 r4))
(log "r3 - r4 " (-rat r3 r4))
(log "r3 * r4 " (*rat r3 r4))
(log "r3 / r4 " (/rat r3 r4))


