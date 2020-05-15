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

from models.blog import (
    filtered_blog,
    filtered_blogs,
)

import config
import os
from werkzeug.utils import secure_filename


main = Blueprint('api_blog', __name__)


def allow_file(filename):
    suffix = filename.split('.')[-1]
    from config import accept_user_file_type
    return suffix in accept_user_file_type


@main.route('/all', methods=['GET'])
def abstract():
    fields = [
        'id',
        'cover_name',
        'title',
        'excerpt',
        'created_time',
        'updated_time',
    ]
    d = {k: True for k in fields}
    blogs = Blog.all(projection=d)
    log('传回来的 blogs', blogs)
    bs = [b.json() for b in blogs]
    form = {
        'code': 200,
        'blogs': bs,
    }
    return jsonify(form)


@main.route('/post/<blog_id>', methods=['GET'])
def detail(blog_id):
    log('api blog detail start')
    log('get blog_id', blog_id)

    fields = [
        'id',
        'cover_name',
        'title',
        'content',
        'created_time',
        'updated_time',
    ]

    d = {k: True for k in fields}
    blog = Blog.find_by(id=blog_id, projection=d)
    form = {}

    if blog is None:
        form = {
            'code': 404,
            'message': '找不到请求的网页',
        }
    else:
        form = {
            'code': 200,
            'blog': blog.json(),
        }
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
    blog = Blog.find_by(id=blog_id)
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
    excerpt = form.content[:300]
    log('excerpt built', excerpt)
    form['excerpt'] = excerpt
    u = User.current_user()
    log('md 文章内容', form['content'])
    # form['user_d'] = u.id
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


@main.route('/upload', methods=['POST'])
@login_required
def upload_images():
    log('上传图片')
    path = config.client_path

    if not os.path.exists(path):
        os.makedirs(path)

    log('request files', request.files)
    if 'image' not in request.files:
        return redirect(url_for('blog.new'))

    # getlist 参数与前端命名一致
    files = request.files.getlist('image')
    log('上传的所有文件', files)
    for file in files:
        filename = file.filename
        log('文件的文件名', filename)
        if allow_file(filename):
            filename = secure_filename(filename)
            filename = os.path.join(path, filename)
            log('最终文件路径', filename)
            file.save(filename)

    result = {
        'code': 200,
        'message': '上传成功',
    }
    return jsonify(result)


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
