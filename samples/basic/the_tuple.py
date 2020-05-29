classmetas = ('Michael', 'Bob', 'Tracy')
print('classmetas ', classmetas)

number = len(classmetas)
print('number ', number)

first = classmetas[0]
last = classmetas[number - 1]
print('first ', first)
print('last ', last)

t = ('a', 'b', ['A', 'B'])
print('t ', t)

t[2][0] = 'X'
t[2][1] = 'Y'
print('t ', t)

# Question.
L = [
    ['Apple', 'Google', 'Microsoft'],
    ['Java', 'Python', 'Ruby', 'PHP'],
    ['Adam', 'Bart', 'Lisa']
]
print('L ', L)

apple = L[0][0]
print(apple)

python = L[1][1]
print(python)

lisa = L[2][2]
print(lisa)