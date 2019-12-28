(define (log num)
   (display num)
   (newline))


(define (f1)
   (define start 3)
   
   (define calc
      (lambda (x0)
         (log x0)
         (+ x0 (sin x0))))

   (define try
      (lambda (value times)
         (if (<= times 20)
            (try (calc value) (+ times 1)))))
   (try start 1))

(f1)