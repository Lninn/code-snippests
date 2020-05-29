#! /usr/bin/env python3
# coding: utf-8

__author__ = 'Lninn'

import re, time, json, logging, hashlib, base64, asyncio, markdown2

from coreweb import get, post
from models import User, Blog, Comment, next_id
from apis import APIValueError, APIError, APIPermissionError, APIResourceNotFoundError
from aiohttp import web
from config import configs
from utils import Page, check_is_next, check_admin, text2html, user2cookie, cookie2user

_RE_EMAIL = re.compile(r'^[a-z0-9\.\-\_]+\@[a-z0-9\-\_]+(\.[a-z0-9\-\_]+){1,4}$')
_RE_SHA1 = re.compile(r'^[0-9a-f]{40}$')

COOKIE_NAME = 'awesession'
_COOKIE_KEY = configs.session.secret

'''
    后端 api
    获取日志：GET /api/blogs
    创建日志：POST /api/blogs
    修改日志：POST /api/blogs/:blog_id
    删除日志：POST /api/blogs/:blog_id/delete
    获取评论：GET /api/comments
    创建评论：POST /api/blogs/:blog_id/comments
    删除评论：POST /api/comments/:comment_id/delete
    创建用户：POST /api/users
    获取用户：GET /api/users
    登陆验证：POST /api/authenticate
    获取博客：GET /api/blogs/{id}
'''

@get('/api/blogs')
async def api_blogs(*, page = '1'):
    ''' 获取 blog list '''

    logging.info(page)
    index = check_is_next(page)
    nums = await Blog.findNumber('count(id)')
    p = Page(totals = nums, index = index)

    if nums == 0:
        return dict(page = p, blogs = ())
    blogs = await Blog.findAll(orderBy = 'created_at desc', limit = p.page_offset())

    for b in blogs:
        b['comments_num'] = await Comment.findNumber('count(id)', where='blog_id=?', args=(b.id, ))

    return dict(blogs = blogs, page = p)

@post('/api/blogs')
async def api_create_blog(request, *, name, summary, content):
    ''' 创建 blog '''

    check_admin(request)
    if not name or not name.strip():
        raise APIValueError('name', 'name cannot be empty.')
    if not summary or not summary.strip():
        raise APIValueError('summary', 'summary cannot be empty.')
    if not content or not content.strip():
        raise APIValueError('content', 'content connot be empty.')

    u = request.__user__
    blog = Blog(user_id = u.id, user_name = u.name, user_image = u.image, name = name.strip(), summary = summary.strip(), content = content.strip())
    await blog.save()

    #test
    # for x in range(1, 30):
    #     u = request.__user__
    #     blog = Blog(user_id = '001527582357663bcc594c853634318befc9648061352ee003', user_name = 'Bob', user_image = 'no image', name = '这是第' + str(x) + '篇日志的标题', summary = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', content = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')
    #     await blog.save()

    return blog

@post('/api/blogs/{id}')
async def api_update_blog(id, request, *, name, summary, content):
    ''' 更新 blog '''

    check_admin(request)
    blog = await Blog.find(id)
    if not name or not name.strip():
        raise APIValueError('name', 'name cannot be empty.')
    if not summary or not summary.strip():
        raise APIValueError('summary', 'summary cannot be empty.')
    if not content or not content.strip():
        raise APIValueError('content', 'content cannot be empty.')

    blog.name = name.strip()
    blog.summary = summary.strip()
    blog.content = content.strip()
    await blog.update()

    return blog

@post('/api/blogs/{id}/delete')
async def api_delete_blog(request, *, id):
    ''' 删除 blog '''

    check_admin(request)
    blog = await Blog.find(id)
    await blog.remove()

    return dict(id = id)

@get('/api/comments')
async def api_comments(*, page = '1'):
    ''' 获取 comments '''

    index = check_is_next(page)
    nums = await Comment.findNumber('count(id)')
    p = Page(totals = nums, index = index)
    if nums == 0:
        return dict(page = p, comments = ())
    comments = await Comment.findAll(orderBy = 'created_at desc', limit = p.page_offset())

    return dict(page = p, comments = comments)

@post('/api/blogs/{id}/comments')
async def api_create_comment(id, request, *, content):
    ''' 创建 comment '''

    u = request.__user__
    if not u:
        APIPermissionError('Please signin first.')
    if not content or not content.strip():
        APIValueError('content', 'content cannot be empty.')

    blog = await Blog.find(id)
    if not blog:
        APIResourceNotFoundError('blog', 'Not found.')
    comment = Comment(blog_id = blog.id, user_id = u.id, user_name = u.name, user_image = u.image, content = content.strip())
    await comment.save()

    return comment

@post('/api/comments/{id}/delete')
async def api_delete_comment(request, *, id):
    ''' 删除 comment '''

    check_admin(request)
    comment = await Comment.find(id)
    if not comment:
        APIResourceNotFoundError('id', 'id Not found.')
    await comment.remove()

    return dict(id = id)

@post('/api/users')
async def api_register_user(*, email, name, password):
    ''' 用户注册 api '''

    if not name or not name.strip():
        raise APIValueError('name')
    name = name.strip()
    if not email or not _RE_EMAIL.match(email):
        raise APIValueError('email')
    if not password or not _RE_SHA1.match(password):
        logging.info('api register user args password: {0} {1}'.format(password,  _RE_SHA1.match(password)))
        raise APIValueError('password')
    users = await User.findAll('email=?', [email])
    if users and len(users) > 0:
        raise APIError('register: failed', 'email', 'Email is already in use.')

    uid = next_id()
    sha1_password = '{0}:{1}'.format(uid, password)
    save_password = hashlib.sha1(sha1_password.encode('utf-8')).hexdigest()
    save_image = 'no image'
    user =User(id = uid, name = name, email = email, password = save_password, image = save_image)
    await user.save()

    r = web.Response()
    r.set_cookie(COOKIE_NAME, user2cookie(user, 86400), max_age = 86400, httponly = True)
    user.password = '********'
    r.content_type = 'application/json'
    r.body = json.dumps(user, ensure_ascii = False).encode('utf-8')

    return r

@get('/api/users')
async def api_get_users(*, page = '1'):
    ''' 获取 users '''

    index = check_is_next(page)
    nums = await User.findNumber('count(id)')
    p = Page(totals = nums, index = index)
    if nums == 0:
        return dict(page = p, users = ())

    users = await User.findAll(orderBy = 'created_at desc', limit = p.page_offset())
    for u in users:
        u.password = '********'

    return dict(page = p, users = users)

@post('/api/authenticate')
async def authenticate(*, email, password):
    ''' 登陆处理 '''

    if not email:
        raise APIValueError('email', 'Invalid email.')
    if not password:
        raise APIValueError('password', 'Invalid password.')

    users = await User.findAll('email=?', [email])
    if len(users) == 0:
        raise APIValueError('email', 'Email not exist.')
    user = users[0]

    sha1 = hashlib.sha1()
    sha1.update(user.id.encode('utf-8'))
    sha1.update(b':')
    sha1.update(password.encode('utf-8'))

    if user.password != sha1.hexdigest():
        raise APIValueError('password', 'Invalid.')

    r = web.Response()
    r.set_cookie(COOKIE_NAME, user2cookie(user, 86400), max_age=86400, httponly=True)
    user.password = '********'
    r.content_type = 'application/json'
    r.body = json.dumps(user, ensure_ascii = False).encode('utf-8')

    return r

@get('/api/blogs/{id}')
async def api_get_blog(*, id):
    ''' 根据 id 获取博客 '''

    blog = await Blog.find(id)

    return blog

'''
    管理页面
    评论列表页：GET /manage/comments
    日志列表页：GET /manage/blogs
    用户列表页：GET /manage/users
    创建日志页：GET /manage/blogs/create
    修改日志页：GET /manage/blogs/
'''

@get('/manage/comments')
def manage_comments(*, page = '1'):
    ''' comments 页面 '''

    return {
        '__template__': 'manage_comments.html',
        'page_index': check_is_next(page)
    }

@get('/manage/blogs')
async def manage_blogs(*, page = '1'):
    ''' blog 页面 '''

    return {
        '__template__': 'manage_blogs.html',
        'page_index': check_is_next(page)
    }

@get('/manage/users')
def manage_users(*, page = '1'):
    ''' users 页面 '''

    return {
        '__template__': 'manage_users.html',
        'page_index': check_is_next(page)
    }

@get('/manage/blogs/create')
def manage_create_blog():
    ''' 获取创建 blog 页面 '''

    return {
        '__template__': 'manage_blog_edit.html',
        'id': '',
        'action': '/api/blogs'
    }

@get('/manage/blogs/edit')
def manage_edit_blog(*, id):
    ''' 编辑 blog 页面 '''

    return {
        '__template__': 'manage_blog_edit.html',
        'id': id,
        'action': '/api/blogs/{0}'.format(id)
    }

'''
    用户浏览页面
    注册页：GET /register
    登录页：GET /signin
    注销页：GET /signout
    首页：GET /
    日志详情页：GET /blog/:blog_id
'''

@get('/register')
def register():
    return {
        '__template__': 'register.html'
    }

@get('/signin')
def signin():
    return {
        '__template__': 'signin.html'
    }

@get('/signout')
def signout(request):
    ''' 退出登陆 '''

    referer = request.headers.get('Referer')
    r = web.HTTPFound(referer or '/')
    r.set_cookie(COOKIE_NAME, '-deleted-', max_age = 0, httponly = True)
    logging.info('user signed out.')
    return r

@get('/')
async def index(request):
    ''' 主页 '''

    # blogs = await Blog.findAll(orderBy = 'created_at desc', limit=(0, 5))

    return {
        '__template__': 'blogs.html',
        '__user__': request.__user__,
        # 'blogs': blogs
    }

@get('/blog/{id}')
async def get_blog(id):
    ''' 获取 blog 详细信息 '''

    blog = await Blog.find(id)
    comments = await Comment.findAll('blog_id=?', [id], orderBy = 'created_at desc')
    for c in comments:
        c.html_content = text2html(c.content)
    blog.html_content = markdown2.markdown(blog.content)

    return {
        '__template__': 'blog.html',
        'blog': blog,
        'comments': comments
    }
