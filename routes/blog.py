from flask import (
    render_template,
    request,
    redirect,
    url_for,
    Blueprint,
    jsonify,
)
from models.user import User
from models.blog import Blog
from utils import log

main = Blueprint('blog', __name__)


@main.route('/')
def index():
    user = User.current_user()
    log('current user ({})'.format(user))
    if user is None:
        return redirect(url_for('admin.login'))

    blogs = Blog.find_all(user_id=user.id)
    return render_template('blog_index.html', blogs=blogs)


@main.route('/new')
def new():
    user = User.current_user()
    log('new blog, current user ({})'.format(user))
    if user is None:
        return redirect(url_for('admin.login'))

    return render_template('blog_new.html')


@main.route('/articles/<int:blog_id>', methods=['GET'])
def detail(blog_id):
    cur_user = User.current_user()
    log('当前的用户是({})'.format(cur_user))
    if cur_user is None:
        return redirect(url_for('admin.login'))

    cur_uid = cur_user.id
    blog = Blog.find_by(id=blog_id)
    if blog is None or cur_user.id != blog.user_id:
        return redirect(url_for('.index'))

    return render_template('blog_detail.html', blog=blog)


@main.route('/add', methods=['POST', 'GET'])
def add():
    u = User.current_user()
    if u is None:
        return redirect(url_for('admin.login'))

    # 创建微博
    if request.method == 'GET':
        log('get add route')
        return redirect(url_for('.index'))

    form = dict(request.form)
    log('post 博客', form)
    # u = User.current_user()
    blog = Blog.new(form, user_id=u.id)
    return redirect(url_for('.detail', blog_id=blog.id))
