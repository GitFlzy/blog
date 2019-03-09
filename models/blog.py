import time
from models import Model
from models import save

from utils import log


# 针对我们的数据 Blog
# 我们要做 4 件事情
"""
C create 创建数据
R read 读取数据
U update 更新数据
D delete 删除数据

Blog.new() 来创建一个 Blog
"""


class Blog(Model):
    @classmethod
    def update(cls, id, form):
        t = cls.find(id)
        valid_names = [
            'title',
            'completed'
        ]
        for key in form:
            # 这里只应该更新我们想要更新的东西
            if key in valid_names:
                setattr(t, key, form[key])
        t.ut = int(time.time())
        t.save()
        return t

    @classmethod
    def complete(cls, id, completed=True):
        """
        用法很方便
        Blog.complete(1)
        Blog.complete(2, False)
        """
        t = cls.find(id)
        t.completed = completed
        t.save()
        return t

    def __init__(self, form):
        self.id = None
        self.user_id = int(form.get('user_id', -1))
        self.author = form.get('author', '')
        self.title = form.get('title', '')
        self.content = form.get('content', '')
        # 下面的是默认的数据
        self.completed = False
        # ct ut 分别是 created_time  updated_time
        # 创建时间和 更新时间
        self.ct = int(time.time())
        self.ut = self.ct

    def comments(self):
        return Comment.find_all(blog_id=self.id)

    def json(self):
        log('json blog object start')
        d = self.__dict__.copy()
        comments = [c.json() for c in self.comments()]
        d['comments'] = comments
        log('json end, self', d)
        return d


# 评论类
class Comment(Model):
    def __init__(self, form, user_id=-1):
        self.id = form.get('id', None)
        self.author = form.get('author', '待定')
        self.content = form.get('content', '')
        # 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
        self.user_id = form.get('user_id', user_id)
        self.blog_id = int(form.get('blog_id', -1))
        self.reply_id = int(form.get('reply_id', -1))
        self.root_id = int(form.get('root_id', -1))
        self.ct = int(time.time())
        self.ut = self.ct

    @classmethod
    def delete_by(cls, **kwargs):
        k, v = '', ''
        for key, value in kwargs.items():
            k, v = key, value
        all = cls.all()
        for i, m in enumerate(all):
            # m = all[i]
            if v == m.__dict__[k]:
                obj = all.pop(i)
                log('delete_by pop obj', obj)
                l = [m.__dict__ for m in all]
                path = cls.db_path()
                save(l, path)
                return obj
        return None
