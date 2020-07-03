求值器决定了一个程序设计语言中各个表达式的意义，而它本身也不过就是另一个程序。

## 语法

- 自求值表达式
- 查找变量
- 引用表达式
- 变量的赋值
- 变量的定义
- if 条件判断
- lambda 表达式
- begin 表达式
- 分情况分析 cond
- 过程应用

```
exp ->
(define (append x y) (if (null? x) y (cons (car x) (append (cdr x) y))))

global ->
[
  (false true car cdr cons null?)
  (
   #f
   #t
   (primitive #[compiled-procedure 15 ("list" #x1) #x1a #x4b8052])
   (primitive #[compiled-procedure 16 ("list" #x2) #x1a #x4b80c2])
   (primitive #[compiled-procedure 17 ("list" #x3) #x14 #x4b812c])
   (primitive #[compiled-procedure 18 ("list" #x5) #x14 #x4b81cc])
  )
]

👇 定义分支

definition-variable: append
definition-value: (eval <lambda> global)
definition-value: ('procedure <parameters> <body> global)

global ->
[
  (append false true car cdr cons null?)
  (
   ('procedure <parameters> <body> global)
   #f
   #t
   (primitive #[compiled-procedure 15 ("list" #x1) #x1a #x4b8052])
   (primitive #[compiled-procedure 16 ("list" #x2) #x1a #x4b80c2])
   (primitive #[compiled-procedure 17 ("list" #x3) #x14 #x4b812c])
   (primitive #[compiled-procedure 18 ("list" #x5) #x14 #x4b81cc])
  )
]

```