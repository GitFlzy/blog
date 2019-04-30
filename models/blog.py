import time
from models import Mongodb
from utils import log
from models.user import User


def filtered_blog(blog, **kwargs):
    valid_attributes = [
        'id',
        'title',
        'content',
        'ct',
    ]
    form = {}
    for key in valid_attributes:
        if hasattr(blog, key):
            value = getattr(blog, key)
            form[key] = value
    if (kwargs.get('abstract', False)):
        form['content'] = form['content'][: 450]
    return form


def filtered_blogs(blogs, **kwargs):
    blog_list = []
    for blog in blogs:
        blog_list.append(filtered_blog(blog, **kwargs))
    return blog_list


class Blog(Mongodb):
    __fields__ = Mongodb.__fields__ + [
        ('content', str, ''),
        ('title', str, -1),
        ('user_id', int, -1),
        ('author', str, ''),
        ('views', int, 0),
    ]

    @classmethod
    def new(cls, form):
        blog = super().new(form)
        log('new blog', blog)
        u = User.current_user()
        setattr(blog, 'user_id', u.id)
        blog.save()
        log('after add user info, blog', blog)
        return blog

    @classmethod
    def update(cls, id, form):
        t = cls.find(id)
        log('要尝试更新的博客', t)
        log('update 传进来的 form 和 id', form, id)
        if t is None:
            log('尝试对一个不存在的博客更新')
            return None
        valid_names = [
            'title',
            'completed',
            'content',
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
        blogs = super().all()
        blogs.reverse()
        bs = [b for b in blogs if b.deleted is False]
        return bs

    def increase_visits(self):
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
        del d._id
        # comments = [c.json() for c in self.comments()]
        # d['comments'] = comments
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
                bs.append(b)
        return bs

    @classmethod
    def find_by(cls, **kwargs):
        blog = super().find_by(**kwargs)
        if blog is None or blog.deleted is True:
            return None
        return blog


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
