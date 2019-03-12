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
    def all(cls):
        all_blogs = super().all()
        bs = [b for b in all_blogs if b.deleted is False]
        return bs

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
        super().__init__()
        self.id = None
        self.user_id = int(form.get('user_id', -1))
        self.author = form.get('author', '')
        self.title = form.get('title', '')
        self.content = form.get('content', '')
        # 下面的是默认的数据
        self.completed = False
        self.ct = int(time.time())
        self.ut = self.ct
        self.visits = 0
        self.replies = 0
        self.deleted = False

    def update_visits(self):
        self.visits += 1
        self.save()

    def update_replies(self):
        self.replies = len(self.comments())
        self.save()

    def comments(self):
        all_comments = Comment.find_all(blog_id=self.id)
        return [c for c in all_comments if c.deleted is False]

    def json(self):
        log('json blog object start')
        d = self.__dict__.copy()
        comments = [c.json() for c in self.comments()]
        d['comments'] = comments
        log('json end, self', d)
        return d

    def delete(self):
        Comment.delete_all(blog_id=self.id)
        self.deleted = True
        self.save()

    @classmethod
    def find_all(cls, **kwargs):
        blogs = super().find_all(**kwargs)
        bs = [b for b in blogs if b.deleted is False]
        return bs

    @classmethod
    def find_by(cls, **kwargs):
        blog = super().find_by(**kwargs)
        if blog is None or blog.deleted is True:
            return None
        return blog


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
        self.deleted = False
        self.agreed = 0

    def delete(self):
        self.deleted = True
        self.save()

    @classmethod
    def delete_all(cls, **kwargs):
        blogs = cls.all()
        for k, v in kwargs.items():
            for b in blogs:
                if b.__dict__[k] == v and b.deleted is False:
                    b.delete()

    @classmethod
    def find_all(cls, **kwargs):
        comments = super().find_all(**kwargs)
        cs = [c for c in comments if c.deleted is False]
        return cs

    @classmethod
    def find_by(cls, **kwargs):
        comment = super().find_by(**kwargs)
        if comment is None or comment.deleted is True:
            return None
        return comment

    def agree(self):
        self.agreed += 1
        self.save()
