classmetas = ['Michael', 'Bob', 'Tracy']
print('classmetas ', classmetas)

number = len(classmetas)
print('number ', number)

first = classmetas[0]
last = classmetas[2]
print('first ', first)
print('last ', last)

last = classmetas[-1]
print('last ', last)

classmetas.append('Adam')
print('classmetas ', classmetas)

classmetas.insert(1, 'Jeck')
print('classmetas ', classmetas)

removed = classmetas.pop()
print('removed ', removed)
print('classmetas ', classmetas)

removed2 = classmetas.pop(1)
print('removed2 ', removed2)
print('classmetas ', classmetas)

classmetas[1] = 'Sarch'
print('classmetas ', classmetas)

L = ['Apple', 123, True]
print('L ', L)