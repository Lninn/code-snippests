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