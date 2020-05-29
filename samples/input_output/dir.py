import os, sys
from datetime import datetime
path = os.path

t = sys.argv[0]
cwd, _ = path.split(t)

files = os.listdir(cwd)

print('      Size     Last Modified  Name')
print('------------------------------------------------------------')

for f in files:
    f = path.join(cwd, f)
    fsize = os.path.getsize(f)
    c = os.path.getmtime(f)
    mtime = datetime.fromtimestamp(c).strftime('%Y-%m-%d %H:%M')
    flag = '/' if os.path.isdir(f) else ''
    print('%10d  %s  %s%s' % (fsize, mtime, f, flag))
