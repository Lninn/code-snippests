def f(x):
    return x * x

ret = map(f, list(range(1, 10)))
print('ret ', list(ret))

s = list(map(str, list(range(1, 10))))
print('s ', s)

# Question.
def normalize(name):
    return name[0].upper() + name[1:]


# Test.
L1 = ['adam', 'LISA', 'barT']
L2 = list(map(normalize, L1))
print(L2)