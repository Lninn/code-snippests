L = ['Michael', 'Sarah', 'Tracy', 'Bob', 'Jack']

print(L[0:3])
print(L[:3])

print(L[1:3])

L = list(range(100))
print('L ', L)

print(L[0:10])
print(L[-10:])

print(L[10:20])

print(L[:10:2])

print(L[::5])

t = (1, 2, 3, 4, 5)
print(t[:3])

s = 'ABCDEFG'
print(s[:3])


# Question.
def trim(s):
    if len(s) == 0:
        return s

    start = s[0]
    while start == ' ':
        s = s[1:]
        if len(s) == 0:
            return s
        start = s[0]
    
    end = s[-1]
    while end == ' ':
        s = s[:-1]
        print(s)
        end = s[-1]
    return s

# Test.
if trim('hello  ') != 'hello':
    print('测试失败!')
elif trim('  hello') != 'hello':
    print('测试失败!')
elif trim('  hello  ') != 'hello':
    print('测试失败!')
elif trim('  hello  world  ') != 'hello  world':
    print('测试失败!')
elif trim('') != '':
    print('测试失败!')
elif trim('    ') != '':
    print('测试失败!')
else:
    print('测试成功!')