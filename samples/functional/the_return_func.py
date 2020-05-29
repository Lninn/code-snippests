def lazy_func():
    a = 123
    b = True

    def fun():
        b = a
        b = 456
        print('b ', b)
        return 'OK'
    
    return fun


def createCounter():
    count = 0
    def counter():
        nonlocal count
        count = count + 1
        return count
    return counter


# Test.
counterA = createCounter()
print(counterA(), counterA(), counterA(), counterA(), counterA()) # 1 2 3 4 5
counterB = createCounter()
if [counterB(), counterB(), counterB(), counterB()] == [1, 2, 3, 4]:
    print('测试通过!')
else:
    print('测试失败!')    