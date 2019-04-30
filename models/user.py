from flask import (
    session,
    redirect,
    url_for,
)
from models import Mongodb
from config import salt_key
from functools import wraps
from utils import log


def login_required(route_func):
    @wraps(route_func)
    def func(*args, **kwargs):
        user = User.current_user()
        if user is None:
            log('user is None', user)
            return redirect(url_for('admin.login', error='用户未登录'))
        log('当前用户', user.id, user.username)
        return route_func(*args, **kwargs)
    return func


class User(Mongodb):
    """
    User 是一个保存用户数据的 model
    现在只有两个属性 email 和 password
    """
    __fields__ = Mongodb.__fields__ + [
        # (字段名, 类型, 值)
        ('email', str, ''),
        ('password', str, ''),
        ('avatar', str, ''),
        ('username', str, 'gw123'),
        ('subtitle', str, '付出 xx 不一定得到 yy'),
    ]

    def remove_sensitives(self):
        self.__dict__.pop('password', None)
        self.__dict__.pop('role', None)
        self.__dict__.pop('id', None)
        self.__dict__.pop('deleted', None)

    def update_password(self, form):
        old = form.get('current_password')
        new = form.get('new_password')
        again = form.get('again_password')
        if User.legal_password(old) and (new == again and
           User.salted_password(old) == self.password):
            new = User.salted_password(new)
            self.update({'password': new})
            # self.password = User.salted_password(new)
            # self.save()
            return True
        return False

    @classmethod
    def legal_password(cls, pwd):
        return len(pwd) > 4

    @classmethod
    def legal_email(cls, email):
        return '@' in email and len(email) > 5

    @classmethod
    def profile(cls, id):
        u = cls.find_by(id=id)
        u.remove_sensitives()
        return u.json()

    def save_image(self, file, path):
        log('save path', path)
        file.save(path)
        log('after save file')
        self.avatar = file.filename
        self.save()

    @classmethod
    def clear_login_status(cls):
        session.pop('user_id', None)

    @classmethod
    def salted_password(cls, password, salt=salt_key):
        import hashlib
        def sha256(ascii_str):
            return hashlib.sha256(ascii_str.encode('ascii')).hexdigest()
        hash1 = sha256(password)
        hash2 = sha256(hash1 + salt)
        return hash2

    @classmethod
    def hashed_password(cls, pwd):
        import hashlib
        # 用 ascii 编码转换成 bytes 对象
        p = pwd.encode('ascii')
        s = hashlib.sha256(p)
        # 返回摘要字符串
        return s.hexdigest()

    @classmethod
    def validate_rule(cls, form):
        # len : email > 2, password > 4 
        email = form.get('email', '')
        pwd = form.get('password', '')
        return User.legal_email(email) and User.legal_password(pwd)

    @classmethod
    def existent(cls, form):
        uid = form.get('id', '')
        if User.find_by(id=uid) is None:
            return False
        else:
            return True

    @classmethod
    def validate_register(cls, form):
        form = dict(form)
        form.pop('role', None)
        if cls.validate_rule(form) and not cls.existent(form):
            pwd = form.get('password', '')
            pwd = cls.salted_password(pwd)
            form['password'] = pwd
            u = User.new(form)
            session['user_id'] = u.id
            return u
        else:
            return None

    @classmethod
    def validate_login(cls, form):
        # form = dict(form)
        uname = form.get('username', '')
        pwd = form.get('password', '')
        u = User.find_by(email=uname)
        if u is None or u.password != User.salted_password(pwd):
            return False
        else:
            session['user_id'] = u.id
            session['logged_in'] = True
            return True

    @classmethod
    def current_user(cls):
        uid = int(session.get('user_id', -1))
        u = cls.find_by(id=uid)
        return u

    @classmethod
    def register(cls, form):
        u = cls(form)
        if u.validate_register():
            u = cls.new(form)
            return u
