from functools import reduce

def add(x, y):
    return x + y

ret = reduce(add, list(range(1, 10)))
print('ret ', ret)

def fn(x, y):
    return x * 10 + y

ret = reduce(fn, [1, 3, 5, 7, 9])
print('ret ', ret)


# Question.
def prod(L):
    def fn(x, y):
        return x * y

    return reduce(fn, L)


DIGITS = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}
def extends(source = {}, data = {}):
    tmp = source.copy()

    for key in data.keys():
        tmp[key] = data[key]
    
    return tmp

DIGITS = extends(DIGITS, { '.': -1 })
def str2float(s):

    def char2num(s):
        return DIGITS[s]
    
    def fn(x, y):
        return x * 10 + y

    idx = s.index('.')
    s1 = s[:idx]
    s2 = s[idx+1:]

    n1 = reduce(fn, map(char2num, s1))
    n2 = reduce(fn, map(char2num, s2))
    
    return n1 + n2 / pow(10, len(s2))


# Test.
if prod([3, 5, 7, 9]) == 945:
    print('测试成功!')
else:
    print('测试失败!')    

if abs(str2float('123.456') - 123.456) < 0.00001:
    print('测试成功!')
else:
    print('测试失败!')