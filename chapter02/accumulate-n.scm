(load "accumulate.scm")

(define (sequence-first seqs)
  (map car seqs))

(define (sequence-next seqs)
  (map cdr seqs))

(define (accumulate-n op init seqs)
  (if (null? (car seqs))
      '()
      (cons (accumulate op init (sequence-first seqs))
            (accumulate-n op init (sequence-next seqs)))))