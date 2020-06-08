(load "huffman.scm")

(define sample-tree
  (make-code-tree (make-leaf 'A 4)
                  (make-code-tree
                   (make-leaf 'B 2)
                   (make-code-tree (make-leaf 'D 1)
                                   (make-leaf 'C 1)))))

(define sample-message
  '(a d a b b c a))

(define sample-pairs
  '((A 4) (B 2) (C 1) (D 1)))

; (0 1 1 0 0 1 0 1 0 1 1 1 0)
(generate-huffman-tree sample-pairs)