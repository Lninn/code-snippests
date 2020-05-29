import sys
from os import path

def getPath(fileName):
    argv = sys.argv
    fullPath = argv[0]

    subPath, x = path.split(fullPath)
    return path.join(subPath, fileName)

filePath = getPath('test.txt')

with open(filePath, 'w') as f:
    for x in range(20):
        f.write(str(x))

