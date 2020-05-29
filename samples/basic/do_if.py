# s = input('birth: ')
# birth = int(s)
# if birth < 2000:
#     print('00前')
# else:
#     print('00后')

# Question.
height = 1.75
weight = 80.5

ibm = weight / (height * height)

if ibm > 32:
    print('A')
elif ibm > 28 and ibm <= 32:
    print('B')
elif ibm > 25 and ibm <= 28:
    print('C')
elif ibm > 18.5 and ibm <= 25:
    print('D')
else:
    print('E')