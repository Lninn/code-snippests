L = list(range(1, 11))
print('L ', L)

L = [x * x for x in range(1, 11)]
print('L ', L)

L = [x * x for x in range(1, 11) if x % 2 == 0]
print('L ', L)

L = [m + n for m in 'ABC' for n in 'XYZ']
print('L ', L)

import os
L = [d for d in os.listdir('.')]
print('L ', L)

L = [k + '=' + v for k, v in { 'x': 'A', 'y': 'B', 'z': 'C' }.items()]
print('L ', L)

L = [s.lower() for s in ['Hello', 'World', 'IBM', 'Apple']]
print('L ', L)

# Question.
L1 = ['Hello', 'World', 18, 'Apple', None]
L2 = [x.lower() for x in L1 if isinstance(x, str)]

if L2 == ['hello', 'world', 'apple']:
    print('测试通过!')
else:
    print('测试失败!')