import time
from models import Mongodb
from utils import log

import markdown


class Blog(Mongodb):
    __fields__ = Mongodb.__fields__ + [
        ('content', str, ''),
        ('title', str, -1),
        ('user_id', int, -1),
        ('author', str, ''),
        ('views', int, 0)
    ]

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
        bs = []
        for b in all_blogs:
            if b.deleted is False:
                b.markdown()
                bs.append(b)
        return bs

    def update_visits(self):
        self.visits += 1
        self.save()

    def update_replies(self):
        self.replies = len(self.comments())
        self.save()

    def comments(self):
        all_comments = Comment.find_all(blog_id=self.id)
        return all_comments

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
        bs = []
        for b in blogs:
            if b.deleted is False:
                b.markdown()
                bs.append(b)
        return bs

    @classmethod
    def find_by(cls, **kwargs):
        blog = super().find_by(**kwargs)
        if blog is None or blog.deleted is True:
            return None
        blog.markdown()
        return blog

    def markdown(self):
        exts = ['markdown.extensions.extra', 'markdown.extensions.codehilite',
                'markdown.extensions.tables', 'markdown.extensions.toc']
        self.content = markdown.markdown(self.content, extensions=exts)


# 评论类
class Comment(Mongodb):
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

    @staticmethod
    def default_content():
        return '该评论已删除'

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
        cs = []
        for c in comments:
            if c.deleted is True:
                c.content = cls.default_content()
            cs.append(c)
        # cs = [c for c in comments if c.deleted is False]
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
