from flask import (
    render_template,
    request,
    redirect,
    url_for,
    Blueprint,
    jsonify,
)

from models.user import (
    User,
    login_required,
)

from models.blog import (
    Blog,
    filtered_blog,
    filtered_blogs,
)

from models.progress import (
    Progress,
)

from utils import log
import config
import os
import time
import re

main = Blueprint('blog', __name__)


def timestamp():
    return int(time.time())


@main.route('/', methods=['GET'])
def index():
    # log('all blogs', Blog.all())
    # blogs = Blog.all()
    return render_template('index.html')


@main.route('/NotFound', methods=['GET', 'POST'])
def not_found():
    return render_template('index.html')


@main.route('/post/<blog_id>', methods=['GET'])
def detail(blog_id):
    log('请求的blog id', blog_id)
    # blog = Blog.find_by(id=int(blog_id))
    return render_template('index.html')


@main.route('/new/blog', methods=['GET'])
@login_required
def new():
    # /edit?blog_id=xx
    query = request.args
    blog_id = query.get('blog_id', '')
    blog = Blog.find(blog_id)
    content = ''
    if blog is not None:
        content = blog.title + '\r\n' + '\r\n' + blog.body
    log('new blog ({})'.format(blog))
    return render_template('blog_new.html', blog=blog, content=content)


@main.route('/edit/blog', methods=['GET'])
@login_required
def edit():
    blogs = Blog.all()
    # blogs = filtered_blogs(blogs)
    return render_template('blog_edit.html', blogs=blogs)


@main.route('/delete/<blog_id>', methods=['DELETE'])
@login_required
def delete(blog_id):
    log('请求文件，删除的 id 是', blog_id)
    blog = Blog.find_by(id=blog_id)
    blog.delete()
    return redirect(url_for('.edit'))


@main.route('/post/blog', methods=['POST'])
@login_required
def post():
    form = request.form.to_dict()
    log('post blog, from', form)
    form = Blog.assembled(form)
    log('after assemble, form', form)

    blog_id = form.get('blog_id', '')
    if blog_id == '':
        log('blog id is (), now new a blog')
        blog = Blog.new(form)
    else:
        log('blog is not empty, update blog id', blog_id)
        blog = Blog.update(blog_id, form)
    return redirect(url_for('.index'))


@main.route('/about', methods=['POST', 'GET'])
def about():
    return render_template('index.html')


@main.route('/post/progress', methods=['POST'])
@login_required
def post_progress():
    log('post progress start')
    form = request.form.to_dict()
    log('提交的 progress 表单', form)
    Progress.new(form)
    return redirect(url_for('.about'))


@main.route('/new/progress', methods=['GET'])
@login_required
def release():
    log('new progress start')
    return render_template('release.html')
