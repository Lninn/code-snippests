def power(x):
    return x * x


def power(x, n = 2):
    s = 1
    while n > 0:
        n = n - 1
        s = s * x
    return s


def enroll(name, gender, age = 6, city = 'Beijing'):
    print('name ', name)
    print('gender ', gender)
    print('age ', age)
    print('city ', city)
    print('\n')


# def add_end(L = []):
#     L.append('END')
#     return L


def calc(*numbers):
    sum = 0
    for n in numbers:
        sum += n * n
    return sum


def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)
    print('\n')


assert power(5) == 25
assert power(5, 2) == 25
assert power(15) == 225
assert power(5, 3) == 125

enroll('Sarah', 'F')
enroll('Bob', 'M', 7)
enroll('Adam', 'M', city='Tianjin')

assert calc(1, 2, 3) == 14
assert calc(1, 3, 5, 7) == 84
assert calc(1, 2) == 5
assert calc() == 0
assert calc(*[1, 2, 3]) == 14

person('Michael', 30)
person('Bob', 35, city='Beijing')
person('Adam', 45, gender='M', job='Engineer')

print('Done.')