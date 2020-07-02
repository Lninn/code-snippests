(define apply-in-underlying-scheme apply)

(define (apply procedure arguments)
  (cond ((primitive-procedure? procedure)
         (apply-primitive-procedure procedure arguments))
        ((compound-procedure? procedure)
         (eval-sequence
            (procedure-body procedure)
            (extend-environment (procedure-parameters procedure)
                                arguments
                                (procedure-env procedure))))
        (else
         (error "Unknow procedure type -- APPLY" procedure))))