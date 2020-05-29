# try:
#     print('try...')
#     r = 10 / 0
#     print('result ', r)
# except ZeroDivisionError as e:
#     print('except ', e)
# finally:
#     print('finally...')
# print('END')

# try:
#     print('try...')
#     r = 10 / 2
#     print('result ', r)
# except ZeroDivisionError as e:
#     print('except ', e)
# finally:
#     print('finally...')
# print('END')


def foo():
    raise UnicodeError('value error')
try:
    print('try...')
    foo()
    print('done')
except ValueError as e:
    print('ValueError ', e)
except UnicodeError as e:
    print('UnicodeError ', e)
finally:
    print('finally')