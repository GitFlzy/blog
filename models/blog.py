import time
from models import Mongodb
from utils import log
from models.user import User
import io
import re
import os
import config


def filtered_blog(blog, **kwargs):
    valid_attributes = [
        'id',
        'title',
        'content',
        # 'created_time',
        'ct',
        'nextId',
        'nextTitle',
        'prevId',
        'prevTitle',
    ]
    form = {}
    for key in valid_attributes:
        if hasattr(blog, key):
            value = getattr(blog, key)
            form[key] = value
    if (kwargs.get('abstract', False)):
        form['content'] = form['content'][: 300]
    return form


def filtered_blogs(blogs, **kwargs):
    blog_list = []
    for blog in blogs:
        blog_list.append(filtered_blog(blog, **kwargs))
    return blog_list


class Blog(Mongodb):
    __fields__ = Mongodb.__fields__ + [
        ('id', str, ''),
        ('title', str, ''),
        ('excerpt', str, ''),
        # ('content', str, ''),
        ('body', str, ''),
        ('next_title', str, ''),
        ('previous_title', str, ''),
        ('user_id', int, -1),
        ('views', int, 0),
        ('cover_name', str, ''),
        # ('author', str, ''),
        ('next_id', str, ''),
        ('previous_id', str, ''),
    ]

    @classmethod
    def new(cls, form, **kwargs):
        blog = super().new(form, **kwargs)
        log('new blog', blog)
        u = User.current_user()
        setattr(blog, 'user_id', u._id)
        blog.id = str(blog._id)
        blog.save()
        Blog.update_adjacency()
        # log('after add user info, blog', blog)
        return blog

    @classmethod
    def update(cls, id, form):
        t = cls.find(id)
        log('要尝试更新的博客', t)
        log('update 传进来的 form 和 id', form, id)
        if t is None:
            log('尝试对一个不存在的博客更新')
            return None
        for key in form:
            setattr(t, key, form[key])
        t.ut = int(time.time())
        t.save()
        Blog.update_adjacency()
        return t

    @classmethod
    def all(cls, **kwargs):
        blogs = super().all(**kwargs)
        blogs.reverse()
        # bs = [b.json() for b in blogs]
        # bs = [b.remove('deleted') for b in bs]
        return blogs

    def increase_visits(self):
        self.visits += 1
        self.save()

    def update_replies(self):
        self.replies = len(self.comments())
        self.save()

    def comments(self):
        all_comments = Comment.find_all(blog_id=self._id)
        return all_comments

    def json(self):
        # log('json blog object start')
        d = self.__dict__.copy()
        log('json end, self', d)
        return d

    def delete(self):
        # Comment.delete_all(blog_id=self._id)
        self.deleted = True
        self.update_adjacency()
        self.save()

    @classmethod
    def _update_first(cls):
        blogs = Blog.all()
        first = blogs[0]
        first.next_id = ''
        first.next_title = ''
        first.save()

    @classmethod
    def _update_last(cls):
        blogs = Blog.all()
        last = blogs[-1]
        last.previous_id = ''
        last.previous_title = ''
        last.save()

    @classmethod
    def update_adjacency(cls):
        blogs = Blog.all()

        if len(blogs) == 0:
            return

        Blog._update_first()
        Blog._update_last()

        for i in range(len(blogs)):
            if i > 0:
                next_blog = blogs[i - 1]
                blog.next_id = next_blog.id
                blog.next_title = next_blog.title
            if i < len(blogs) - 1:
                prev_blog = blogs[i + 1]
                blog.previous_id = prev_blog.id
                blog.previous_title = prev_blog.title
            blog.save()
        
    @classmethod
    def find_all(cls, **kwargs):
        blogs = super().find_all(**kwargs)
        return blogs

    @classmethod
    def find_by(cls, **kwargs):
        blog = super().find_by(**kwargs)
        log('find by id : blog', blog)
        # if blog is None or blog.deleted is True:
        #     return None
        return blog

    @classmethod
    def assembled(cls, form):
        content = form.pop('content')
        content_list = re.split(r'[\r\n]', content, 1)

        title = content_list[0]
        body = content_list[1].lstrip()
        log('生成的 body ', body)
        log('拆分body', re.split(r'[\r\n]', body, 1))
        excerpt = re.split(r'[\r\n]', body, 1)[0].strip()
        log('生成的简介', excerpt)
        form['body'] = body
        form['excerpt'] = excerpt
        form['title'] = title

        cover_name = form.get('cover_name', None)
        if cover_name is not None:
            cover_name = os.path.join(config.server_path, cover_name)
            form['cover_name'] = cover_name

        return form


# 评论类
class Comment(Mongodb):
    def __init__(self, form, user_id=-1):
        self._id = form.get('id', None)
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
