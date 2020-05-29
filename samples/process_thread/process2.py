from multiprocessing import Process
import os

def runProc(name):
    print('Run child process %s (%s)...' % (name, os.getpid()))

if __name__ == '__main__':
    print('Parent process %s. ' % os.getpid())
    p1 = Process(target=runProc, args=('test', ))
    p2 = Process(target=runProc, args=('test2', ))
    print('Child process will start.')
    p1.start()
    p2.start()
    p1.join()
    p2.join()
    print('Child process end.')