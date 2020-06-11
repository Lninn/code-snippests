(load "p-3.3-make-account-with-pass.scm")

; make-joint
(define (make-joint target-account target-pass my-pass)
  (define (dispatch m new-pass)
    (if (eq? my-pass new-pass)
        (target-account m target-pass)
        (lambda (x) "Incorrect password")))
  dispatch)

(define peter-acc (make-account 100 'open-sesame))

(define paul-acc
  (make-joint peter-acc 'open-sesame 'resebud))