from utils import log

from models.blog import Comment
from models.blog import Blog
from models.user import (
    User,
    login_required,
)

from flask import (
    request,
    Blueprint,
    jsonify,
    redirect,
    url_for,
)


main = Blueprint('api_blog', __name__)


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


@main.route('/all', methods=['GET'])
def index():
    blogs = Blog.all()
    log('blogs', blogs)
    blogs = filtered_blogs(blogs)
    return jsonify(blogs)


@main.route('/all/abstract', methods=['GET'])
def abstract():
    blogs = Blog.all()
    blogs = filtered_blogs(blogs, abstract=True)
    return jsonify(blogs)


@main.route('/<int:blog_id>', methods=['GET'])
def detail(blog_id):
    log('api blog detail start')
    blog = Blog.find_by(id=blog_id)
    form = {
        'blog': filtered_blog(blog),
        'status': True,
    }
    if blog is None:
        form['status'] = False
        form['location'] = '404'
    return jsonify(form)


@main.route('/<int:blog_id>/comment/all')
def all_comments(blog_id):
    log('debug all comments')
    b = Blog.find_by(id=blog_id)
    comments = b.comments()
    cs = [c.json() for c in comments]
    log('debug comments', cs)
    return jsonify(cs)


@main.route('/delete/<int:blog_id>', methods=['DELETE'])
@login_required
def delete_blog(blog_id):
    log('debug 删除博客')

    cur_user = User.current_user()
    if cur_user is None:
        log('当前用户是', cur_user)
        return redirect(url_for('admin.login'))

    log('debug 当前用户', cur_user)
    cur_uid = cur_user.id
    blog = Blog.find_by(id=blog_id)
    owner_uid = blog.user_id
    if cur_user.id != owner_uid:
        log("""用户(uid={})想要访问用户(uid={})的博客,
            跳转到用户(uid={})的博客主页""".format(cur_uid, owner_uid, cur_uid))
        return redirect(url_for('.index'))

    log('debug before 删除博客')
    blog.delete()
    return jsonify({'status': True})


@main.route('/login', methods=['POST'])
def login():
    form = request.get_json()
    result = {}
    if User.validate_login(form):
        log('登陆成功')
        result['location'] = '/admin/profile'
        result['status'] = True
    else:
        log('登录失败')
        result['status'] = False
    return jsonify(result)
    

@main.route('/user/profile', methods=['GET'])
def user_profile():
    u = User.profile(1)
    log('用户简介', u)
    return jsonify(u)


@main.route('/add', methods=['POST'])
@login_required
def add():
    # 创建微博
    form = request.get_json()
    log('post 博客', form)
    u = User.current_user()
    log('md 文章内容', form['content'])
    blog = Blog.new(form, user_id=u.id)
    form = {
        'status': True,
        'location': '/articles/{}'.format(blog.id),
        'title': blog.title,
        'content': blog.content,
        'dateTime': blog.ct,
        'id': blog.id,
    }
    return jsonify(form)


@main.route('/comment/add', methods=['POST'])
def add_comment():
    log('进入 add_comment 函数')
    form = request.get_json()
    blog_id = int(form.get('blog_id', -1))
    b = Blog.find_by(id=blog_id)
    user_id = b.user_id
    form['user_id'] = user_id
    log('debug *** form ***', form)

    o = Comment.new(form)
    b.update_replies()
    log('debug ** new comment', o)
    rf = {
        'comment': o.json(),
        'replies': b.replies,
    }
    log('rf', rf)
    log('jsonify rf', jsonify(rf), type(jsonify(rf)))
    return jsonify(rf)
