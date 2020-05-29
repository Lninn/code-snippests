import threading

localSchool = threading.local()


def processStudent():
    std = localSchool.student
    print('Hello, %s (in %s)' % (std, threading.current_thread().name))

def processThread(name):
    localSchool.student = name
    processStudent()

t1 = threading.Thread(target=processThread, args=('Alice', ), name='T-a')
t2 = threading.Thread(target=processThread, args=('Bob', ), name='T-b')

t1.start()
t2.start()

t1.join()
t2.join()
