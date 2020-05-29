from functools import reduce
import logging

# def str2num(s):
#     try:
#         return int(s)
#     except ValueError as e:
#         logging.exception(e)
    
#     try:
#         return float(s)
#     except ValueError as e:
#         print('ValueError ', e)
#         raise

def str2num(s):
    try:
        return int(s)
    except ValueError as e:
        return float(s)
    except ValueError as e:
        print('ValueError ', e)
        raise  
        
          

def calc(exp):
    ss = exp.split('+')
    ns = map(str2num, ss)
    return reduce(lambda acc, x: acc + x, ns)

def main():
    r = calc('100 + 200 + 345')
    print('100 + 200 + 345 =', r)
    r = calc('99 + 88 + 7.6')
    print('99 + 88 + 7.6 =', r)

main()