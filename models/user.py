from models import Model
from flask import session
from models.blog import Blog

from config import salt_key


class User(Model):
    """
    User 是一个保存用户数据的 model
    现在只有两个属性 username 和 password
    """
    def __init__(self, form):
        self.id = form.get('id', None)
        self.username = form.get('username', '')
        self.password = form.get('password', '')
        self.role = int(form.get('role', 5))
        self.email = form.get('email', 'example@email.com')
        self.icon_link = form.get('icon_link', '')

    def Blogs(self):
        blogs = Blog.find_all(user_id=self.id)
        return blogs

    @classmethod
    def salted_password(cls, password, salt=salt_key):
        import hashlib
        def sha256(ascii_str):
            return hashlib.sha256(ascii_str.encode('ascii')).hexdigest()
        hash1 = sha256(password)
        hash2 = sha256(hash1 + salt)
        return hash2

    def hashed_password(self, pwd):
        import hashlib
        # 用 ascii 编码转换成 bytes 对象
        p = pwd.encode('ascii')
        s = hashlib.sha256(p)
        # 返回摘要字符串
        return s.hexdigest()

    @classmethod
    def validate_rule(cls, form):
        # len : username > 2, password > 4 
        uname = form.get('username', '')
        pwd = form.get('password', '')
        if len(uname) > 2 and len(pwd) > 4:
            return True
        else:
            return False

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
        # uname = form.get('username', '')
        form.pop('role', None)
        if cls.validate_rule(form) and not cls.existent(form):
            pwd = form.get('password', '')
            pwd = cls.salted_password(pwd)
            form['password'] = pwd
            u = User.new(form)
            return u
        else:
            return None

    @classmethod
    def validate_login(cls, form):
        # form = dict(form)
        uname = form.get('username', '')
        pwd = form.get('password', '')
        u = User.find_by(username=uname)
        if u is None or u.password != User.salted_password(pwd):
            return False
        else:
            session['user_id'] = u.id
            return True

    @classmethod
    def current_user(cls):
        uid = int(session.get('user_id', -1))
        u = cls.find_by(id=uid)
        return u

    @classmethod
    def register(cls, form):
        """
        validate_login 返回
        :参数 form 是一个包含用户名和用户密码的表单, 如下格式:
            form = {
                'username': 'example_username',
                'password': 'example_password',
            }
        """
        u = cls(form)
        if u.validate_register():
            u = cls.new(form)
            return u
