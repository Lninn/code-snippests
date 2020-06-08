(load "huffman.scm")

(define sample-pairs
  '((A 2) (NA 16) (BOOM 1) (SHA 3) (GET 2) (YIP 9) (JOB 2) (WAH 1)))

(define tree (generate-huffman-tree sample-pairs))

(define mes-1 '(Get a job Sha na na na na na na na na Get a job))

(define message-2
  '(Get a job
    Sha na na na na na na na na
    Get a job
    Sha na na na na na na na na
    Wah yip yip yip yip yip yip yip yip yip
    Sha boom))
