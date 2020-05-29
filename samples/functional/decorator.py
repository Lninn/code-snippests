def now():
    print('2020-04-17')

f = now
print(f.__name__)

k = lambda x : x + 1
f = k
print(f.__name__)

def log(func):
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper


def log(text):
    def decorator(func):
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator

# now = log(now)
# @log
# def now():
#     print('2015-3-25')

# now()

# Question.
import time, functools

def metric(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        start = time.time()
        ret = func(*args, **kw)
        interval = time.time() - start
        print('%s executed in %s ms' % (func.__name__, interval))
        return ret
    return wrapper

# Test.
@metric
def fast(x, y):
    time.sleep(0.0012)
    return x + y

@metric
def slow(x, y, z):
    time.sleep(0.1234)
    return x * y * z

f = fast(11, 22)
s = slow(11, 22, 33)
if f != 33:
    print('测试失败!')
elif s != 7986:
    print('测试失败!')


def log(text = None):
    if isinstance(text, (str,)):
        def decorator(func):
            @functools.wraps(func)
            def wrapper(*args, **kw):
                print('%s %s():' % (text, func.__name__))
                return func(*args, **kw)
            return wrapper
        return decorator
    else:
        func = text
        @functools.wraps(func)
        def wrapper(*args, **kw):
            print('call %s():' % func.__name__)
            return func(*args, **kw)
        return wrapper

@log
def f1():
    print('f1')
f1()

@log('execute')
def f2():
    print('f2')

f2()