(load "signal.scm")
(load "full-adder.scm")
(load "agenda.scm")

(define the-agenda (make-agenda))

(define (probe name wire)
  (add-action! wire
               (lambda ()
                 (newline)
                 (display name)
                 (display " ")
                 (display (current-time the-agenda))
                 (display " New-value = ")
                 (display (get-signal wire)))))

(define inverter-delay 2)
(define and-gate-delay 3)
(define or-gate-delay 5)

(define a (make-wire))
(define b (make-wire))
(define c-in (make-wire))
(define sum (make-wire))
(define c-out (make-wire))

(probe 'sum sum)
(probe 'c-out c-out)

(full-adder a b c-in sum c-out)

(set-signal! a 1)

(set-signal! b 0)

(set-signal! c-in 0)

(propagate)