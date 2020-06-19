; p-3.39
(define x 10)

(define s (make-serizlizer))

(parallel-execute (lambda () (set! x (s (lambda () (* x x)))))
                  (s (lambda () (set! x (+ x 1)))))

; p1 过程， 计算 x 的新值，和 更新 x 值 的过程是分开的
; 交错赋值的情况有一定的概率发生

; p2 过程，基于当前值 + 1
