#! usr/bin/env python3
# coding: utf-8

# import asyncio, subprocess, time, sys, orm, hashlib, os
#
# from models import User, Blog, Comment
# from time import sleep
#
# CMD="C://Users//thl38\Desktop\python-web//aio-http//app.py"

# class Auto_Run():
#     def __init__(self, sleep_time, cmd):
#         self.sleep_time = sleep_time
#         self.cmd = cmd
#         self.ext = (cmd[-3:]).lower() #判断文件的后缀名,全部换成小写
#         self.p = None  #self.p为subprocess.Popen()的返回值,初始化为None
#         self.run() #启动时先执行一次程序
#
#         try:
#             while 1:
#                 time.sleep(sleep_time*6)#休息10分钟,判断程序状态
#                 self.poll=self.p.poll()#判断程序进程是否存在,None:表示程序正在运行其他值:表示程序已退出
#                 if self.poll is None:
#                     print("运行正常")
#                 else:
#                     print("未检测到程序运行状态,准备启动程序")
#                     self.run()
#         except KeyboardInterruptase:
#             print("检测到CTRL+C,准备退出程序!")
#             #self.p.kill()#检测到CTRL+C时,kill掉CMD中启动的exe或者jar程序
#
#     def run(self):
#         if self.ext == ".py":
#             print('start OK!')
#             self.p = subprocess.Popen(['python','%s'%self.cmd],stdin=sys.stdin,stdout=sys.stdout,stderr=sys.stderr,shell=False)
#         else:
#             pass
# def run_script():
#     print('运行脚本...')
#     global pro
#     pro = subprocess.Popen(['python', f'{CMD}'], stdin = sys.stdin, stdout = sys.stdout, stderr = sys.stderr, shell = False)
# def prog():
#     if pro.poll() is None:
#         print('脚本运行中，关闭')
#         result = pro.kill()
#         print('关闭的返回值: ', result)
#         run_script()
# def reset():
#     file_name1 = r'C:\Users\thl38\Desktop\python-web\web-app\www\templates\manage_blog_edit.html'
#     file_name2 = r'C:\Users\thl38\Desktop\python-web\web-app\www\handlers.py'
#
#     file_content1 = open(file_name1, encoding = 'utf-8').read().encode('utf-8')
#     md5_before1 = hashlib.md5(file_content1).hexdigest()
#
#     file_content2 = open(file_name2, encoding = 'utf-8').read().encode('utf-8')
#     md5_before2 = hashlib.md5(file_content2).hexdigest()
#     while 1:
#         sleep(1)
#         temp_content1 = open(file_name1, encoding = 'utf-8').read().encode('utf-8')
#         temp1 = hashlib.md5(temp_content1).hexdigest()
#
#         temp_content2 = open(file_name2, encoding = 'utf-8').read().encode('utf-8')
#         temp2 = hashlib.md5(temp_content2).hexdigest()
#
#         if temp1 != md5_before1 or temp2 != md5_before2:
#             print('文本内容已改变')
#             prog()
#             md5md5_before1 = temp1
#             md5md5_before2 = temp2
#             reset()
# run_script()
# reset()
# s = 'insert into `users` (`email`, `passwd`, `admin`, `name`, `image`, `created_at`, `id`) values (%s, %s, %s, %s, %s, %s, %s) ['rwe@dass.com', None, False, 'test', 'no image', 1521868664.2250142, <built-in function id>]'

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import sys, os, time, subprocess

def log(s):
    print('[Monitor] %s' % s)

class MyFileSystemEventHander(FileSystemEventHandler):

    def __init__(self, fn):
        super(MyFileSystemEventHander, self).__init__()
        self.restart = fn

    def on_any_event(self, event):
        if event.src_path.endswith('.py') or event.src_path.endswith('.html'):
            log('Python source file changed: %s' % event.src_path)
            self.restart()

command = ['echo', 'ok']
process = None

def kill_process():
    global process
    if process:
        log('Kill process [%s]...' % process.pid)
        process.kill()
        process.wait()
        log('Process ended with code %s.' % process.returncode)
        process = None

def start_process():
    global process, command
    log('Start process %s...' % ' '.join(command))
    process = subprocess.Popen(['python', f'{command}'], stdin = sys.stdin, stdout = sys.stdout, stderr = sys.stderr, shell = False)

def restart_process():
    kill_process()
    start_process()

def start_watch(path, callback):
    observer = Observer()
    observer.schedule(MyFileSystemEventHander(restart_process), path, recursive=True)
    observer.start()
    log('Watching directory %s...' % path)
    start_process()
    try:
        while True:
            time.sleep(0.5)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == '__main__':
    print('running...')

    arg = sys.argv[1]
    if not arg or not str(arg).endswith('.py'):
        print('Use  like: pyhton/python3 test.py app.py')
        exit(0)
    command = arg
    path = os.path.abspath('.')
    start_watch(path, None)





#
