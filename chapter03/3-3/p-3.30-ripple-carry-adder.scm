; ripple-carry-adder

(load "agenda.scm")
(load "full-adder.scm")
(load "signal.scm")
(load "one-d-table.scm")

(define the-agenda (make-agenda))
(define inverter-delay 2)
(define and-gate-delay 3)
(define or-gate-delay 5)

(define count 5)

(define (probe name wire)
  (add-action! wire
               (lambda ()
                 (newline)
                 (display name)
                 (display " ")
                 (display (current-time the-agenda))
                 (display " New-value = ")
                 (display (get-signal wire)))))

(define (print table index)
  (if (= 6 index)
      'done
      (begin (display " ")
             (display (get-signal (lookup index table)))
             (print table (+ index 1))))
  )

(define (create name set)
  (define (iter set table index)
    (cond ((= (length set) 0) table)
          (else
           (let ((a (make-wire))
                 (value (car set)))
             (probe (string-append name (number->string index)) a)
             (set-signal! a value)
             (insert! index a table)
             (iter (cdr set) table (+ index 1))))))

  (iter set (make-table) 1))

; input Ak Bk
; output Sk C

(define An
  (create "a" (list 0 0 0 0 1)))

(define Bn
  (create "b" (list 0 0 0 0 1)))

(define Sn
  (create "s" (list 0 0 0 0 0)))

(define C-OUT
  (make-wire))

(define (ripple-carry-adder c-in index)
  (if (= count index)
      (full-adder
        (lookup index An)
        (lookup index Bn)
        c-in
        (lookup index Sn)
        C-OUT)
      (let ((c-out (make-wire)))
        (full-adder (lookup index An)
                    (lookup index Bn)
                    c-in
                    (lookup index Sn)
                    c-out)
        (ripple-carry-adder c-out (+ index 1)))))

(ripple-carry-adder (make-wire) 1)

(propagate)

(newline)
(print Sn 1)