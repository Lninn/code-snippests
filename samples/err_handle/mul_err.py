# try:
#     print('try...')
#     r = 10 / int('3')
#     print('result ', r)
# except ValueError as e:
#     print('ValueError ', e)
# except ZeroDivisionError as e:
#     print('ZeroDivisionError ', e)
# else:
#     print('no err')
# finally:
#     print('finally...')
# print('END')

try:
    print('try...')
    r = 10 / int('0')
    print('result ', r)
except Exception as e:
    print('Exception ', e)
else:
    print('no err')
finally:
    print('finally...')
print('END')