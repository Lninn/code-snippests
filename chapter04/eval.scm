#|
在 env 环境里求值 exp 的值

针对求值 exp 的语法类型 分情况分析
基本元素：self-evaluating?
求值变量：variable?
引用表达式：quoted?
更新变量的值：assignment?
定义变量或者过程：definition?
条件判断：if?
lambda表达式：lambda?
begin表达式：begin?
分情况分析表达式：cond?
复合表达式：application?
|#
(define (eval exp env)
  (cond ((self-evaluating? exp) exp)
        ((variable? exp) (lookup-variable-value exp env))
        ((quoted? exp) (text-of-quotation exp))
        ((assignment? exp) (eval-assignment exp env))
        ((definition? exp) (eval-definition exp env))
        ((if? exp) (eval-if exp env))
        ((lambda? exp)
         (make-procedure (lambda-parameters exp)
                         (lambda-body exp)
                         env))
        ((begin? exp)
         (eval-sequence (begin-actions exp) env))
        ((cond? exp) (eval (cond->if exp) env))
        ((application? exp)
         (apply (eval (operator exp) env)
                (list-of-values (operatands exp) env)))
        (else
         (error "Unknow expression type -- EVAL" exp))))