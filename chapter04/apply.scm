#|
apply 对过程 procedure 和参数 arguments 求值

primitive-procedure?
如果 procedure 是基本过程，直接应用参数计算出过程的值

compound-procedure?
如果 procedure 是复合过程，顺序的求值组成 procedure
的过程体的那些表达式。
在求值复合过程的体时需要建立相应的环境，即扩充该过程所携带的
基本环境，并加入一个框架，其中将过程的各个形式参数约束与过程
调用的实际参数
|#
(define (apply procedure arguments)
  (cond ((primitive-procedure? procedure)
         (apply-primitive-procedure procedure arguments))
        ((compound-procedure? procedure)
         (eval-sequence
           (procedure-body procedure)
           (extend-environment
             (procedure-parameters procedure)
             arguments
             (procedure-environment procedure))))
        (else
         (error "Unknow procedure type -- APPLY" procedure))))