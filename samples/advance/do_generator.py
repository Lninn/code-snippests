L = [x * x for x in range(10)]
print('L ', L)

g = (x * x for x in range(10))
print('g ', g)

def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        print(b)
        a, b = b, a + b
        n = n + 1
    return 'done'

def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'    


# Question.
def triangles():
    L = [1]

    def update(source):
        index = 0
        result = []
        length = len(source)

        while 1:
            if index + 1 == length:
                result.insert(0, source[0])
                result.append(source[-1])
                return result

            a = source[index]
            b = source[index + 1]
            result.append(a + b)

            index += 1

    # def update(source, index = 0, result = []):
    #     if index + 1 == len(source):
    #         result.insert(0, source[0])
    #         result.append(source[-1])
    #         return result

    #     a = source[index]
    #     b = source[index + 1]
    #     result.append(a + b)
    #     return update(source, index + 1, result)
    
    while 1:
        yield L
        L = update(L)
    
    return 'Done'


# Test.
n = 0
results = []
for t in triangles():
    results.append(t)
    n = n + 1
    if n == 10:
        break

for t in results:
    print(t)

if results == [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1],
    [1, 6, 15, 20, 15, 6, 1],
    [1, 7, 21, 35, 35, 21, 7, 1],
    [1, 8, 28, 56, 70, 56, 28, 8, 1],
    [1, 9, 36, 84, 126, 126, 84, 36, 9, 1]
]:
    print('测试通过!')
else:
    print('测试失败!')