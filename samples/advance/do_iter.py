from collections import Iterable

print(isinstance('abc', Iterable))
print(isinstance([1, 2, 3], Iterable))
print(isinstance(123, Iterable))

for i, value in enumerate(['A', 'B', 'C']):
    print(i, value)


# Question.
def findMinAndMax(L):
    if len(L) == 0:
        return (None, None)

    minVal = L[0]
    maxVal = L[0]

    for number in L:
        if number >= maxVal:
            maxVal = number
        if number <= minVal:
            minVal = number
    
    return (minVal, maxVal)


# Test.
if findMinAndMax([]) != (None, None):
    print('测试失败!')
elif findMinAndMax([7]) != (7, 7):
    print('测试失败!')
elif findMinAndMax([7, 1]) != (1, 7):
    print('测试失败!')
elif findMinAndMax([7, 1, 3, 9, 5]) != (1, 9):
    print('测试失败!')
else:
    print('测试成功!')