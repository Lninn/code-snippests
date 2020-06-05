; 定义一个对表达式求导的过程 derive

; 假定已经存在了如下的基本过程
; (variable? e)                   ; e 是变量吗
; (same-variable? v1 v2)          ; v1 和 v2 是同一个变量吗
; (sum? e)                        ; e 是和式吗
; (addend e)                      ; e 的被加数
; (augend e)                      ; e 的加数
; (make-sum a1 a2)                ; 构造起 a1 和 a2 的和式
; 
; (product? e)                    ; e 是乘式吗
; (multiplier e)                  ; e 的被乘数
; (multiplicand e)                ; e 的乘数
; (make-product m1 m2)            ; 构造起 m1 和 m2 的乘式

; 基本的求导规则
; 1 常数的导数为 0
; 2 对当前求导变量自身的求导为 1
; 3 (a + b) 的导数为 a 的导数加上 b 的导数
; 4 (a * b) 的导数为 a 的导数乘以 b 加上 b 的导数乘以 a

; 通过求导规则可以发现，这是一个递归过程，
; 最终都可以归纳为对 常数 或者 变量自身的求导

(load "exp-op.scm")

(define (derive exp var)
  (cond ((number? exp) 0)
        ((variable? exp)
         (if (same-variable? exp var) 1 0))
        ((sum? exp)
         (make-sum (derive (addend exp) var)
                   (derive (augend exp) var)))
        ((product? exp)
         (make-sum
           (make-product (multiplier exp)
                         (derive (multiplicand exp) var))
           (make-product (derive (multiplier exp) var)
                         (multiplicand exp))))
        (else
         (error "unknow expression type -- DERIV" exp))))