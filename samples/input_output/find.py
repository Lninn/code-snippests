import os
path = os.path

cwd = os.getcwd()

def find(p, s):
    t = os.listdir(p)
    for x in t:
        a = path.join(p, x)
        if path.isdir(a) and x[0] != '.':
            find(a, s)
        elif path.isfile(a):
            _, name = path.split(a)
            if name.find(s) != -1:
                print(name)

find(cwd, 'do')


