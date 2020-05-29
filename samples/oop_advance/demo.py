class MyClass:
    i = 12345

    def f(self):
        return 'Hi'

    def t(self):
        return self.i

# print(dir(MyClass))   
# print(MyClass.i)     
# print(MyClass.f)
# print(MyClass.f(1))

x = MyClass()
xt = x.t

# print(xt())
# print(xt())
# print(xt())

class Complex:
    def __init__(self, realpart, imagpart):
        self.r = realpart
        self.i = imagpart

# x = Complex(3.0, -4.5)
# print(dir(x))
# print(x.r, x.i)

# class Dog:

#     kind = 'canine'

#     def __init__(self, name):
#         self.name = name

# d = Dog('Fido')
# e = Dog('Buddy')
# print(d.kind)
# print(e.kind)
# print(d.name)
# print(e.name)

# d.kind = 'Test'

# print(d.kind)
# print(e.kind)

class Dog:

    # tricks = []

    def __init__(self, name):
        self.name = name
        self.tricks = []

    def add_trick(self, trick):
        self.tricks.append(trick)

d = Dog('Fido')
e = Dog('Buddy')
d.add_trick('roll over')
e.add_trick('play dead')
print(d.tricks)        