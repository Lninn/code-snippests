#! usr/bin/env python3
# coding: utf-8

import logging, time, hashlib
from models import User

from config import configs

COOKIE_NAME = 'awesession'
_COOKIE_KEY = configs.session.secret

class Page(object):

    def __init__(self, *, totals, index):
        '''
            page_index: 当前页
            page_size: 每页 item 数量
            page_total: item 总数
            page_count = 总页数
        '''
        self.page_index = index or 1
        self.page_size = 10
        self.page_total = totals
        self.page_count = self.get_page_count()
        self.has_next = self.page_index < self.page_total
        self.has_previous = self.page_index > 1

    def get_page_count(self):
        ''' 总页数 '''
        return self.page_total // self.page_size + (1 if self.page_total % self.page_size > 0 else 0)

    def page_offset(self):
        ''' 分页偏移 '''
        if self.page_total == 0 or self.page_index > self.page_total:
            return (0, 0)
        return (self.page_size * (self.page_index - 1), self.page_size)

    def __str__(self):
        return '''
            page_total: {0}, page_count: {1}, pagepage_size: {2}
            page_index: {3}, page_offset: {4}
            '''.format(self.page_total, self.page_count, self.page_size, self.page_index, self.page_offset())

    __repr__ = __str__

def check_is_next(s):
    ''' 分页参数检测 '''
    num = 1
    try:
        num = int(s)
    except ValueError as e:
        pass
    if num < 1:
        num = 1
    return num

def check_admin(request):
    ''' 检测访问权限 '''

    if request and (request.__user__ is None or not request.__user__.admin):
        raise APIPermissionError()

def text2html(text):
    lines = map(lambda s: '<p>%s</p>' % s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'), filter(lambda s: s.strip() != '', text.split('\n')))
    return ''.join(lines)

def user2cookie(user, max_age):
    '''
        根据用户名生成 cookie
        x-x-x-x
    '''

    expires = str(int(time.time() + max_age))
    s = '-'.join([user.id, user.password, expires, _COOKIE_KEY])
    L = [user.id, expires, hashlib.sha1(s.encode('utf-8')).hexdigest()]

    return '-'.join(L)

async def cookie2user(cookie_str):
    '''检查 cookie '''

    if not cookie_str:
        return None

    try:
        L = cookie_str.split('-')
        if len(L) != 3:
            return None
        uid, expires, sha1 = L

        if int(expires) < time.time():
            return None

        user = await User.find(uid)
        if user is None:
            return None
        s = '{0}-{1}-{2}-{3}'.format(uid, user.password, expires, _COOKIE_KEY)
        if sha1 != hashlib.sha1(s.encode('utf-8')).hexdigest():
            logging.info('Invalid sha1.')
            return None
        user.password = '********'

        return user
    except Exception as e:
        logging.exception(e)
        return None
