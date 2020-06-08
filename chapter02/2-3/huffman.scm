; huffman 编码

; 通过 0 和 1 的序列表示数据的方法

; A000 B001 C010 D011 E100 F101 G110 H111

; BACADAEAFABBAAAGAH

; 前缀码：以某种特定的规则设计的编码，使得其中每个字符的完整编码都
;        不是另一个编码的开始一段

; Leaf
(define (make-leaf symbol weight)
  (list 'leaf symbol weight))

(define (leaf? object)
  (eq? (car object) 'leaf))

(define (symbol-leaf x) (cadr x))

(define (weight-leaf x) (caddr x))

; Tree
(define (make-code-tree left right)
  (list left
        right
        (append (symbols left) (symbols right))
        (+ (weight left) (weight right))))

(define (left-branch tree) (car tree))

(define (right-branch tree) (cadr tree))

(define (symbols tree)
  (if (leaf? tree)
      (list (symbol-leaf tree))
      (caddr tree)))

(define (weight tree)
  (if (leaf? tree)
      (weight-leaf tree)
      (cadddr tree)))

; decode
(define (decode bits tree)
  (define (decode-1 bits current-branch)
    (if (null? bits)
        '()
        (let ((next-branch
               (choose-branch (car bits) current-branch)))
          (if (leaf? next-branch)
              (cons (symbol-leaf next-branch)
                    (decode-1 (cdr bits) tree))
              (decode-1 (cdr bits) next-branch)))))
  (decode-1 bits tree))

(define (choose-branch bit branch)
  (cond ((= bit 0) (left-branch branch))
        ((= bit 1) (right-branch branch))
        (else (error "bad bit -- CHOOSE-BRANCH" bit))))

; Adjoin set
(define (addjoin-set x set)
  (cond ((null? set) (list x))
        ((< (weight x) (weight (car set))) (cons x set))
        (else (cons (car set)
                    (addjoin-set x (cdr set))))))

; Make leaf set
(define (make-leaf-set pairs)
  (if (null? pairs)
      '()
      (let ((pair (car pairs)))
        (addjoin-set (make-leaf (car pair)
                                (cadr pair))
                     (make-leaf-set (cdr pairs))))))

; Encode
(define (encode message tree)
  (if (null? message)
      '()
      (append (encode-symbol (car message) tree)
              (encode (cdr message) tree))))

(define (encode-symbol symbol tree)
  (cond ((leaf? tree) '())
        ((symbol-in-tree symbol (left-branch tree))
         (cons 0
               (encode-symbol symbol (left-branch tree))))
        ((symbol-in-tree symbol (right-branch tree))
         (cons 1
               (encode-symbol symbol (right-branch tree))))
        (else
         (error "This symbol not in tree ENCODE-SYMBOL" symbol))))

(define (symbol-in-tree given-symbol tree)
  (not (false?
          (find (lambda (s) (eq? s given-symbol))
                (symbols tree)))))

(define (generate-huffman-tree pairs)
  (successive-merge (make-leaf-set pairs)))

(define (successive-merge set)
  (cond ((= 0 (length set)) '())
        ((= 1 (length set)) (car set))
        (else
         (let ((x (car set))
               (y (cadr set))
               (rest (cddr set)))
          (successive-merge
            (addjoin-set (make-code-tree x y)
                         rest))))))

 