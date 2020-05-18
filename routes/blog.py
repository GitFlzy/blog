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
from bson.objectid import ObjectId
import config
import os
import re
import time


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
    return render_template('404.html')


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
    blog_id = int(query.get('blog_id', -1))
    blog = Blog.find(blog_id)
    log('new blog ({})'.format(blog))
    return render_template('blog_new.html', blog=blog)


@main.route('/edit/blog', methods=['GET'])
@login_required
def edit():
    blogs = Blog.all()
    blogs = filtered_blogs(blogs)
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
    log('发布的表单', form)
    s = re.split('\r|\n|\r\n', form['content'], 1)[0][:150] + '...'
    log('生成的简介', s)
    form['excerpt'] = s

    cover_name = form.get('cover_name', None)
    if cover_name is not None:
        cover_name = os.path.join(config.server_path, cover_name)
        form['cover_name'] = cover_name

    blog_id = int(form.get('blog_id', -1))
    if blog_id == -1:
        blog = Blog.new(form)
    else:
        blog = Blog.update(blog_id, form)
    return redirect(url_for('.index'))


@main.route('/about', methods=['POST', 'GET'])
def about():
    log('about page start')
    entries = Progress.all()
    log('get all progress', entries)
    return render_template('about.html', entries=entries)


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

