#! /usr/bin/env python3
# coding: utf-8

'''
Default configurations.
'''

__author__ = 'Lninn'

configs = {
    'debug': True,
    'db': {
        'host': '127.0.0.1',
        'port': 3306,
        'user': 'www-data',
        # 'password': 'Tian0914',
        'password': 'www-data',
        'db': 'awesome'
    },
    'session': {
        'secret': 'Awesome'
    }
}
